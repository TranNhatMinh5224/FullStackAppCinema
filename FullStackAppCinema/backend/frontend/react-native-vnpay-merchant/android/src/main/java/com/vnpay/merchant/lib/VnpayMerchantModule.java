package com.vnpay.merchant.lib;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.vnpay.authentication.VNP_AuthenticationActivity;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.vnpay.authentication.VNP_SdkCompletedCallback;

public class VnpayMerchantModule extends ReactContextBaseJavaModule {

    public VnpayMerchantModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "VnpayMerchant";
    }

    @ReactMethod
    public void show(String scheme, boolean isSandbox, String paymentUrl, String tmn_code, String backAlert, String title, String titleColor, String beginColor, String endColor, String iconBackName) {
        Intent intent = new Intent(getReactApplicationContext(), VNP_AuthenticationActivity.class);
        intent.putExtra("url", paymentUrl); // URL merchant thanh toán merchant tạo. Tham khảo tại "https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#tao-url-thanh-toan"
		
        intent.putExtra("scheme", scheme); // scheme app, ứng dụng Ngân hàng, Ví mở lại khi thành công
        intent.putExtra("tmn_code", tmn_code); // TmnCode VNPAY cung cấp
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        VNP_AuthenticationActivity.setSdkCompletedCallback(new VNP_SdkCompletedCallback() {
            @Override
            public void sdkAction(String s) {
				
				//Lưu ý: 
				//- Action dưới đây được SDK trả về khi load được các URL tương ứng.
				//- Thực hiện cho luồng Thanh toán qua ATM-Tài khoản-Thẻ quốc tế. Merchant chuyển hướng đến các URL mặc định từ Return URL. SDK sẽ đóng lại và trả về action cho đơn vị kết nối điều hướng về ứng dụng TMDT
				//* WebBackAction: http://cancel.sdk.merchantbackapp
				//* FaildBackAction: http://fail.sdk.merchantbackapp
				//* SuccessBackAction: http://success.sdk.merchantbackapp

                //*action == AppBackAction
                //Người dùng nhấn back từ sdk để quay lại
				
                //action == CallMobileBankingApp
                //Người dùng nhấn chọn thanh toán qua app thanh toán (Mobile Banking, Ví...)
				//lúc này app tích hợp sẽ cần lưu lại mã giao dịch thanh toán (vnp_TxnRef). Khi người dùng mở lại app tích hợp với cheme sẽ gọi kiểm tra trạng thái thanh toán của mã TxnRef . Kiểm tra trạng thái thanh toán của giao dịch để thực hiện nghiệp vụ kết thúc thanh toán / thông báo kết quả cho khách hàng..

                //*action == WebBackAction
                //Kiểm tra mã lỗi thanh toán VNPAY phản hồi trên Return URL. Từ Return URL của đơn vị kết nối thực hiện chuyển hướng đi URL: http://cancel.sdk.merchantbackapp
				// vnp_ResponseCode == 24 / Khách hàng hủy thanh toán.

                //*action == FaildBackAction
                //Kiểm tra mã lỗi thanh toán VNPAY phản hồi trên Return URL. Từ Return URL của đơn vị kết nối thực hiện chuyển hướng đi URL: http://fail.sdk.merchantbackapp 
				// vnp_ResponseCode != 00 / Giao dịch thanh toán không thành công

                //*action == SuccessBackAction
                //Kiểm tra mã lỗi thanh toán VNPAY phản hồi trên Return URL. Từ Return URL của đơn vị kết nối thực hiện chuyển hướng đi URL: http://success.sdk.merchantbackapp//vnp_ResponseCode == 00) / Giao dịch thành công

                WritableMap params = Arguments.createMap();

                if ("AppBackAction".equals(s)) {
                    params.putInt("resultCode", -1);
                } else if ("CallMobileBankingApp".equals(s)) {
                    params.putInt("resultCode", 10);
                } else if ("WebBackAction".equals(s)) {
                    params.putInt("resultCode", 99);
                } else if ("FaildBackAction".equals(s)) {
                    params.putInt("resultCode", 98);
                } else if ("SuccessBackAction".equals(s)) {
                    params.putInt("resultCode", 97);
                }

                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("PaymentBack", params);
            }
        });
        getReactApplicationContext().startActivity(intent);
    }
}
