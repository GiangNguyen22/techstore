package com.example.techstore.service.impl;

import com.example.techstore.dto.request.OrderRequest;
import com.example.techstore.dto.response.OrderResponse;
import com.example.techstore.entity.*;
import com.example.techstore.enums.OrderStatus;
import com.example.techstore.enums.PaymentMethod;
import com.example.techstore.enums.PaymentStatus;
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
}
