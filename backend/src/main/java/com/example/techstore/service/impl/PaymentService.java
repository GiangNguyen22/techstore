package com.example.techstore.service.impl;

import com.example.techstore.config.vnpay.VNPayConfig;
import com.example.techstore.entity.Orders;
import com.example.techstore.entity.Payment;
import com.example.techstore.enums.OrderStatus;
import com.example.techstore.enums.PaymentMethod;
import com.example.techstore.enums.PaymentStatus;
import com.example.techstore.exceptions.ResourceNotFoundEx;
import com.example.techstore.repository.OrderRepository;
import com.example.techstore.repository.PaymentRepository;
import com.example.techstore.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PaymentService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private VNPayConfig vnPayConfig;


    public String createPaymentUrl(Orders order, HttpServletRequest request) {
        BigDecimal totalAmount = order.getTotalAmount().multiply(BigDecimal.valueOf(100L));
        String bankCode = request.getParameter("bankCode");
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(totalAmount.longValue()));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_TxnRef",  order.getId().toString());
        vnpParamsMap.put("vnp_OrderInfo", "Thanh toan don hang:" + order.getId());

        vnpParamsMap.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
        //build query url
        String queryUrl = VNPayUtil.getPaymentURL(vnpParamsMap, true);
        String hashData = VNPayUtil.getPaymentURL(vnpParamsMap, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(VNPayConfig.secretKey, hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;

        return VNPayConfig.vnp_PayUrl + "?" + queryUrl;
    }



    public String handleVnPayReturn(Map<String, String> allParams) {
//        String vnp_SecureHash = allParams.get("vnp_SecureHash");
//        allParams.remove("vnp_SecureHash");
//        allParams.remove("vnp_SecureHashType");
//
//        String signValue = VNPayUtil.hashAllFields(allParams);
//        System.out.println("signValue: " + signValue);
//        System.out.println("vnp_SecureHash: " + vnp_SecureHash);
//
//        if (!signValue.equals(vnp_SecureHash)) {
//            return "Chữ ký không hợp lệ";
//        }

        String responseCode = allParams.get("vnp_ResponseCode");
        String orderIdStr = allParams.get("vnp_TxnRef");

        Integer orderId = Integer.valueOf(orderIdStr);
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundEx("Order not found"));

        if ("00".equals(responseCode)) {
            // Thanh toán thành công
            order.setStatus(OrderStatus.confirmed);
            orderRepository.save(order);

            Payment payment = new Payment();
            payment.setAmount(order.getTotalAmount());
            payment.setPaidAt(LocalDateTime.now());
            payment.setStatus(PaymentStatus.success);
            payment.setPaymentMethod(PaymentMethod.VNPAY);
            payment.setOrder(order);
            paymentRepository.save(payment);

            return "Successful payment";
        } else {
            // Thanh toán thất bại
            order.setStatus(OrderStatus.cancelled);
            orderRepository.save(order);
            return "Failed payment";
        }
    }
}

