#import "VnpayMerchant.h"
#import <CallAppSDK/CallAppInterface.h>

@interface VnpayMerchant()

@property (nonatomic, strong) UIWindow *window1;

@end

@implementation VnpayMerchant

RCT_EXPORT_MODULE();
- (NSArray<NSString *> *)supportedEvents {
    return @[@"PaymentBack"];
}
RCT_EXPORT_METHOD(show:(NSString *)scheme 
                  isSandbox:(BOOL )isSandbox
                  paymentUrl:(NSString *)paymentUrl
                  tmn_code:(NSString *)tmn_code
                  backAlert:(NSString *)backAlert
                  title:(NSString *)title
                  titleColor:(NSString *)titleColor
                  beginColor:(NSString *)beginColor
                  endColor:(NSString *)endColor
                  iconBackName:(NSString *)iconBackName
                  )
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sdkAction:) name:@"SDK_COMPLETED" object:nil];
        
        CGFloat width = [UIScreen mainScreen].bounds.size.width;
        CGFloat height = [UIScreen mainScreen].bounds.size.height;
        
        self.window1 = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, width, height)];
        self.window1.backgroundColor = UIColor.clearColor;
        self.window1.windowLevel = UIWindowLevelAlert;
        self.window1.rootViewController = [[UIViewController alloc] init];
        self.window1.rootViewController.view.backgroundColor = UIColor.clearColor;
        [self.window1 makeKeyAndVisible];
        
        [CallAppInterface setHomeViewController:self.window1.rootViewController];
        [CallAppInterface setSchemes:scheme];
        [CallAppInterface setEnableBackAction:YES];
        [CallAppInterface setIsSandbox:isSandbox];
        [CallAppInterface setAppBackAlert:backAlert];
        [CallAppInterface showPushPaymentwithPaymentURL:paymentUrl
                                              withTitle:title
                                           iconBackName:iconBackName
                                             beginColor:beginColor
                                               endColor:endColor
                                             titleColor:titleColor
                                               tmn_code:tmn_code];
    });
}



-(void)sdkAction:(NSNotification*)notification {
    if ([notification.name isEqualToString:@"SDK_COMPLETED"]){
        self.window1.hidden = YES;
        self.window1 = nil;
        
		//Lưu ý: 
				//- Action dưới đây được SDK trả về khi load được các URL tương ứng.
				//- Thực hiện cho luồng Thanh toán qua ATM-Tài khoản-Thẻ quốc tế. Merchant chuyển hướng đến các URL mặc định từ Return URL. SDK sẽ đóng lại và trả về action cho đơn vị kết nối điều hướng về ứng dụng TMDT
				//* WebBackAction: http://cancel.sdk.merchantbackapp
				//* FaildBackAction: http://fail.sdk.merchantbackapp
				//* SuccessBackAction: http://success.sdk.merchantbackapp
				
        NSString *actionValue=[notification.object valueForKey:@"Action"];
        if ([@"AppBackAction" isEqualToString:actionValue]) {
            //Người dùng nhấn back từ sdk để quay lại
            [self sendEventWithName:@"PaymentBack" body:@{@"resultCode":@-1}];
            return;
        }
        if ([@"CallMobileBankingApp" isEqualToString:actionValue]) {
            //Người dùng nhấn chọn thanh toán qua app thanh toán (Mobile Banking, Ví...)
			//lúc này app tích hợp sẽ cần lưu lại mã giao dịch thanh toán (vnp_TxnRef). Khi người dùng mở lại app tích hợp với cheme sẽ gọi kiểm tra trạng thái thanh toán của mã TxnRef . Kiểm tra trạng thái thanh toán của giao dịch để thực hiện nghiệp vụ kết thúc thanh toán / thông báo kết quả cho khách hàng..
            [self sendEventWithName:@"PaymentBack" body:@{@"resultCode":@10}];
            return;
        }
        if ([@"WebBackAction" isEqualToString:actionValue]) {
            //Kiểm tra mã lỗi thanh toán VNPAY phản hồi trên Return URL. Từ Return URL của đơn vị kết nối thực hiện chuyển hướng đi URL: http://cancel.sdk.merchantbackapp
			// vnp_ResponseCode == 24 / Khách hàng hủy thanh toán.
            [self sendEventWithName:@"PaymentBack" body:@{@"resultCode":@99}];
            return;
        }
        if ([@"FaildBackAction" isEqualToString:actionValue]) {
            //Kiểm tra mã lỗi thanh toán VNPAY phản hồi trên Return URL. Từ Return URL của đơn vị kết nối thực hiện chuyển hướng đi URL: http://fail.sdk.merchantbackapp 
			// vnp_ResponseCode != 00 / Giao dịch thanh toán không thành công
            [self sendEventWithName:@"PaymentBack" body:@{@"resultCode":@98}];
            return;
        }
        if ([@"SuccessBackAction" isEqualToString:actionValue]) {
            //Kiểm tra mã lỗi thanh toán VNPAY phản hồi trên Return URL. Từ Return URL của đơn vị kết nối thực hiện chuyển hướng đi URL: http://success.sdk.merchantbackapp
			//vnp_ResponseCode == 00) / Giao dịch thành công
            [self sendEventWithName:@"PaymentBack" body:@{@"resultCode":@97}];
            return;
        }
    }
}
@end
