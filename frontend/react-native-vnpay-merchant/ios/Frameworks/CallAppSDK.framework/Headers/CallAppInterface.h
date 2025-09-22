//
//  CallAppInterface.h
//  CallAppSDK
//
//  Created by Tien Nguyen on 3/18/19.
//  Copyright © 2019 Tien Nguyen. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface CallAppInterface : NSObject

+(void)setAppNotAvailableAlert:(NSString*)alert;//Default: @"Thiết bị chưa cài đặt ứng dụng thanh toán này, bạn có muốn cài đặt không?"
+ (NSString*)getAppNotAvailableAlert;

+(void)setAppBackAlert:(NSString*)alert;//Default: @"Bạn có chắc chắn muốn trở lại không?"
+ (NSString*)getAppBackAlert;

+(void)setHomeViewController:(UIViewController*)vc;

//+(void)showPushPaymentVC:(UIViewController*)vc withPaymentURL:(NSString*)paymentStr withTitle:(NSString*)titleStr iconBackName:(NSString*)backIcon beginColor:(NSString*)beginColor endColor:(NSString*)endColor titleColor:(NSString*)titleColor tmn_code:(NSString*)tmn_code;

+(void)showPushPaymentwithPaymentURL:(NSString*)paymentStr withTitle:(NSString*)titleStr iconBackName:(NSString*)backIcon beginColor:(NSString*)beginColor endColor:(NSString*)endColor titleColor:(NSString*)titleColor tmn_code:(NSString*)tmn_code;

+ (void)setSchemes:(NSString*)schm;
+ (void)setIsSandbox:(BOOL)isSandBox;

+(void)setEnableBackAction:(BOOL)backEnable;// = True luôn luôn có action khi bấm back

@end


/**
 - Các tham số:
 1. URL: lấy từ hệ thống VD: https://sandbox.vnpayment.vn/tryitnow/Home/CreateOrder
 2. Title của màn hình chọn phương thức thanh toán: VD: "Thanh toán"
 3. iconBackName của màn hình thanh toán:  VD: ion_back
 4: beginColor: Màu bắt đầu của header:  VD: F06744
 5: endColor: Màu kết thúc của header:  VD: E26F2C
 6. tmn_code: VD: 2QXUI4J4
 7: titleColor: Màu của header title
 +(void)setAppBackAlert:(NSString*)alert;//Default: @"Bạn có chắc chắn muốn trở lại không?"
 +(void)setAppNotAvailableAlert:(NSString*)alert;//Default: @"Thiết bị chưa cài đặt ứng dụng thanh toán này, bạn có muốn cài đặt không?"
 7. [CallAppInterface setSchemes:@"sampleApp"];  Hàm set schemes của app để ứng dụng MB gọi quay trở lại khi thanh toán xong. Tham số này set trong URL Types của ứng dụng
 
 
 [CallAppInterface setSchemes:@"sampleapp"];
 [CallAppInterface setAppBackAlert:@"Bạn có chắc chắn trở lại ko?"];
 
 [CallAppInterface showPushPaymentVC:self withPaymentURL:@"https://sandbox.vnpayment.vn/tryitnow/Home/CreateOrder" withTitle:@"Thanh toans" iconBackName:@"ion_back" beginColor:@"F06744" endColor:@"E26F2C" titleColor:@"ffffff" tmn_code:@"2QXUI4J4"];
 
 
 */




NS_ASSUME_NONNULL_END
