import React from 'react'

import { EPayment } from 'rsi-react-filipizen-components'
import OnlineRptBilling from './OnlineRptBilling'

const RptBillingWebController = (props) => {
  const module = { title: 'Realty Tax Online Billing', component: OnlineRptBilling }
  return <EPayment module={module} {...props}  />
}

export default RptBillingWebController
