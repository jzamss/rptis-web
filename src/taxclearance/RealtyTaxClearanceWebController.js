import React from 'react'

import { EPayment } from 'rsi-react-filipizen-components'
import OnlineTaxClearance from './OnlineTaxClearance'

const RealtyTaxClearanceWebController = (props) => {
  const module = { title: 'Online Realty Tax Clearance', component: OnlineTaxClearance }
  return <EPayment module={module} {...props} />
}

export default RealtyTaxClearanceWebController
