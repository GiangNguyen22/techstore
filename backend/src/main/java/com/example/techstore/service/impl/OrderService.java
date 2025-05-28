package com.example.techstore.service.impl;

import com.example.techstore.dto.OrderDetailDto;
import com.example.techstore.dto.request.OrderRequest;
import com.example.techstore.dto.response.OrderResponse;
import com.example.techstore.dto.response.PendingAndCanceledOrderResponse;
import com.example.techstore.dto.response.TotalOrderResponse;
import com.example.techstore.dto.response.TotalSaleResponse;
import com.example.techstore.entity.*;
import com.example.techstore.enums.OrderStatus;
import com.example.techstore.enums.PaymentMethod;
import com.example.techstore.enums.PaymentStatus;
import com.example.techstore.exceptions.ResourceNotFoundEx;
import com.example.techstore.repository.OrderDetailRepository;
import com.example.techstore.repository.OrderRepository;
import com.example.techstore.repository.PaymentRepository;
import com.example.techstore.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private  UserDetailsService userDetailsService;
    @Autowired
    private ProductService productService;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;


    @Transactional
    public OrderResponse createOrder(OrderRequest request, Principal principal, HttpServletRequest httpServletRequest) throws Exception {
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());
        if(request.getAddress()==null){
            throw new BadRequestException("Address is required");
        }
        Orders order = Orders.builder()
                .status(OrderStatus.pending)
                .user(user)
                .totalAmount(request.getTotalAmount())
                .address(request.getAddress())
                .paymentMethod(request.getPaymentMethod())
                .build();

        List<OrderDetails> orderDetails = request.getOrderDetailRequests().stream().map(orderDetailRequest -> {
            try{
                Product product = productService.fetchProductById(orderDetailRequest.getProductId());
                return OrderDetails.builder()
                        .order(order)
                        .product(product)
                        .productVariantId(orderDetailRequest.getProductVariantId())
                        .quantity(orderDetailRequest.getQuantity())
                        .unitPrice(product.getPrice())
                        .build();
            }catch (Exception e){
                throw new RuntimeException(e);
            }
        }).toList();

        order.setOrderDetailsList(orderDetails);

        Orders savedOrder = orderRepository.save(order);


        //Chuẩn bị dữ liệu trả về
        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setOrderId(savedOrder.getId());
        orderResponse.setOrderStatus(OrderStatus.pending);

        // Nếu là COD thì tạo Payment ngay, VNPAY thì chưa cần
        if(order.getPaymentMethod().equals(PaymentMethod.COD)){
            Payment payment = new Payment();
            payment.setStatus(PaymentStatus.pending);
            payment.setAmount(order.getTotalAmount());
            payment.setPaymentMethod(PaymentMethod.COD);
            payment.setOrder(order);
            payment.setPaidAt(LocalDateTime.now());
            orderResponse.setPaymentMethod(PaymentMethod.COD);
            orderResponse.setOrderStatus(OrderStatus.confirmed);
            paymentRepository.save(payment);
        }

        //Nếu thanh toán qua VNPAY
        if(order.getPaymentMethod().equals(PaymentMethod.VNPAY)){
            String paymentUrl = paymentService.createPaymentUrl(order, httpServletRequest);
            orderResponse.setPaymentUrl(paymentUrl);
            orderResponse.setPaymentMethod(PaymentMethod.VNPAY);
        }

        return orderResponse;
    }

    public List<OrderDetailDto> getOrderByUser(String name) {
        User user = (User) userDetailsService.loadUserByUsername(name);
        List<Orders> orders = orderRepository.findByUserId(user.getId());
        List<OrderDetailDto> result = new ArrayList<>();

       for(Orders order : orders){
           for(OrderDetails orderDetail : order.getOrderDetailsList()){
               OrderDetailDto orderDetailDto = getOrderDetailDto(order, orderDetail);

               result.add(orderDetailDto);
           }
       }
       return result;
    }

    private static OrderDetailDto getOrderDetailDto(Orders order, OrderDetails orderDetail) {
        OrderDetailDto orderDetailDto = new OrderDetailDto();
        orderDetailDto.setId(order.getId());
        orderDetailDto.setOrderDate(order.getOrderDate());
        orderDetailDto.setOrderStatus(order.getStatus());
        orderDetailDto.setProductName(orderDetail.getProduct().getName());
        orderDetailDto.setQuantity(orderDetail.getQuantity());
        orderDetailDto.setTotalAmount(order.getTotalAmount());
        orderDetailDto.setUnitPrice(orderDetail.getUnitPrice());
        orderDetailDto.setProductVariantId(orderDetail.getProductVariantId());
        return orderDetailDto;
    }

    public Orders updateOrderStatus(Integer orderId, OrderStatus orderStatus) {
            Orders order = orderRepository.findById(orderId).orElseThrow(()-> new ResourceNotFoundEx("Order not found"));
            order.setStatus(orderStatus);
            return orderRepository.save(order);
    }


    public void cancelOrder(Integer id, Principal principal) {
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());
        Orders order = orderRepository.findById(id).orElseThrow(()-> new ResourceNotFoundEx("Order not found"));

        if( order.getUser().getId().equals(user.getId())
               && (order.getStatus().equals(OrderStatus.pending) || order.getStatus().equals(OrderStatus.confirmed))){
            order.setStatus(OrderStatus.cancelled);
            orderRepository.save(order);
        }else{
            throw new RuntimeException("Invalid request");
        }
    }

    public List<OrderDetailDto> getAllOrder() {
        List<Orders> orders = orderRepository.findAll();
        return getOrderDetailDtos(orders);
    }

    public List<OrderDetailDto> searchByCustomerName(String customerName) {
        List<Orders> orders = orderRepository.searchByCustomerName(customerName);
        return getOrderDetailDtos(orders);

    }

    private List<OrderDetailDto> getOrderDetailDtos(List<Orders> orders) {
        return orders.stream().map(orders1 -> {
            OrderDetailDto orderDetailDto = new OrderDetailDto();
            orderDetailDto.setId(orders1.getId());
            orderDetailDto.setOrderDate(orders1.getOrderDate());
            orderDetailDto.setOrderStatus(orders1.getStatus());
            orderDetailDto.setTotalAmount(orders1.getTotalAmount());
            orderDetailDto.setCustomerName(orders1.getUser().getName());
            return orderDetailDto;
        }).toList();
    }

    public TotalOrderResponse getTotalOrder() {
        LocalDateTime last7Days = LocalDateTime.now().minusDays(7);
        LocalDateTime previousOrderDate = last7Days.minusDays(7);

        Integer totalOrder =orderRepository.getTotalOrderLast7Days(last7Days);
        if(totalOrder == null){
            totalOrder = 0;
        }
        Integer totalPrevious = orderRepository.getTotalOrderLast7Days(previousOrderDate);

        double percentage = 0.0;
        if(totalPrevious != null){
            if(totalOrder > totalPrevious) {
                percentage = ((totalOrder / totalPrevious) - 1) * 100 ;
            }else {
                percentage = (1 - (totalOrder/totalPrevious)) * 100;
            }
        }else{
            totalPrevious = 0;
            percentage = 0.0;
        }


        TotalOrderResponse totalOrderResponse = new TotalOrderResponse();
        totalOrderResponse.setTotalOrders(totalOrder);
        totalOrderResponse.setPercent(percentage);
        totalOrderResponse.setPreviousTotalOrders(totalPrevious);

        return totalOrderResponse;
    }

    public PendingAndCanceledOrderResponse getPendingAndCanceledOrder() {
        LocalDateTime last7Days = LocalDateTime.now().minusDays(7);
        List<Orders> orders = orderRepository.findByOrderDateAfter(last7Days);
        int pendingOrder = 0;
        int cancelOrder = 0;
        for( Orders order : orders){
            if(order.getStatus().equals(OrderStatus.pending)){
                pendingOrder++;
            } else if (order.getStatus().equals(OrderStatus.cancelled)) {
                cancelOrder++;

            }
        }
        return new PendingAndCanceledOrderResponse(pendingOrder, cancelOrder);
    }
}

