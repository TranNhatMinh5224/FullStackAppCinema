import * as React from 'react';
import { NativeModules } from 'react-native'

export const VnpayMerchantModule = NativeModules.VnpayMerchant

interface ShowParam {
    isSandbox?: boolean,
    scheme: string
    backAlert?: string
    paymentUrl?: string
    title?: string
    titleColor?: string //6 ký tự.
    beginColor?: string //6 ký tự.
    endColor?: string //6 ký tự.
    iconBackName?: string,
    tmn_code: string,
}
const VNPMerchant = {
    show(params: ShowParam) {
        let _params: Partial<ShowParam> = Object.assign({
            isSandbox: true,
            paymentUrl: 'https://sandbox.vnpayment.vn/tryitnow/Home/CreateOrder',
            tmn_code: 'FAHASA02',
            backAlert: 'Bạn có chắc chắn trở lại ko?',
            title: 'Thanh toán',
            iconBackName: 'ion_back',
            beginColor: '#F06744', //6 ký tự.
            endColor: '#E26F2C', //6 ký tự.
            titleColor: '#E26F2C', //6 ký tự.
        }, params)
        _params.titleColor = _params.titleColor?.replace(/#/g, '') //6 ký tự.
        _params.beginColor = _params.beginColor?.replace(/#/g, '') //6 ký tự.
        _params.endColor = _params.endColor?.replace(/#/g, '') //6 ký tự.
        // console.log('show', _params)
        VnpayMerchantModule.show(
            _params.scheme,
            _params.isSandbox,
            _params.paymentUrl,
            _params.tmn_code,
            _params.backAlert,
            _params.title,
            _params.titleColor, //6 ký tự.
            _params.beginColor, //6 ký tự.
            _params.endColor, //6 ký tự.
            _params.iconBackName
        )
    }
}
export default VNPMerchant