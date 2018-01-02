class Order {
  constructor (options) {
    this.instance = null
    this.activiteTab = 'tab1'
    this.subTab = 'tab1'
  }

  useCoupon (value) {
    console.log('value: ',value)
    if (value && value.id) {
      this.couponForUse = value
    } else {
      return this.couponForUse
    }
  }
  useCouponNew (value) {
    console.log('value: ',value)
    if (value && value.name) {
      this.couponForUse = value
    } else {
      return this.couponForUse
    }
  }
  clearCoupon () {
    this.couponForUse = null
  }
  useInvoice (value) {
    if (value) {
      this.invoiceForUse = value
    } else {
      return this.invoiceForUse
    }
  }
  clearInvoice () {
    this.invoiceForUse = null
  }
  useShipping (value) {
    if (value) {
      this.shippingForUse = value
    } else {
      return this.shippingForUse
    }
  }
  usePaymentMethods (value) {
    if (value) {
      this.paymentMethodsForUse = value
    } else {
      return this.paymentMethodsForUse
    }
  }
  useTransport (value) {
    if (value) {
      this.transportForUse = value
    } else {
      return this.transportForUse
    }
  }
  clearTransport () {
    this.transportForUse = null
  }
  userShopId (id) {
    if (id) {
      this.shopId = id
    } else {
      return this.shopId
    }
  }
  userCarItem (carItem) {
    if (carItem) {
      this.carItem = carItem
    } else {
      return this.carItem
    }
  }
  userBalancePay (passwordHasSet) {
    if (passwordHasSet) {
      this.passwordHasSet = passwordHasSet
    } else {
      return this.passwordHasSet
    }
  }
  userActiviteTab (activiteTab) {
    if (activiteTab) {
      this.activiteTab = activiteTab
    } else {
      return this.activiteTab
    }
  }
  userSubActiviteTab (subTab) {
    if (subTab) {
      this.subTab = subTab
    } else {
      return this.subTab
    }
  }
  clear () {
    this.shippingForUse = null
    this.paymentMethodsForUse = null
    this.invoiceForUse = null
    this.couponForUse = null
    this.transportForUse = null
  }
}

Order.getInstance = function () {
  if (!this.instance) {
    this.instance = new Order()
  }

  return this.instance
}

export default Order
