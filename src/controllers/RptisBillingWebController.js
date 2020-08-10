import React, { useState } from 'react'
import {
  Panel,
  Text,
  Button,
  FormPanel,
  ActionBar,
  Label,
  Spacer,
  Service,
  Error,
  Loading
} from 'rsi-react-web-components'

import { EPayment, EmailVerification } from 'rsi-react-filipizen-components'

import PayOption from '../components/PayOption'

const txntype = 'rptcol'
const origin = 'filipizen'

const RptisBillingWebController = (props) => {
  const [mode, setMode] = useState('initial')
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [refno, setRefno] = useState()
  const [contact, setContact] = useState({})
  const [showPayOption, setShowPayOption] = useState(false)
  const [bill, setBill] = useState()
  const [po, setPo] = useState()
  const [year, setYear] = useState()
  const [qtr, setQtr] = useState()
  const [barcode, setBarcode] = useState()

  const { partner } = props

  const verifyEmail = (contact) => {
    setContact(contact)
  }

  const getBill = async (billOptions = {}) => {
    const svc = await Service.lookup(`${partner.id}:EPaymentService`)
    const params = { txntype, refno, ...billOptions }
    return await svc.getBilling(params)
  }

  const loadBill = (billOption = {}) => {
    setLoading(true)
    setError(null)
    getBill(billOption)
      .then((bill) => {
        setLoading(false)
        setBill(bill.info)
        setBarcode(`56001:${bill.info.billno}`)
        setMode('viewbill')
      })
      .catch((err) => {
        setLoading(false)
        setError(err.toString())
      })
  }

  const showPayOptionHandler = () => {
    setShowPayOption(true)
  }

  const payOptionHandler = (billOption) => {
    setShowPayOption(false)
    loadBill(billOption)
  }

  const cancelPayOptionHandler = () => {
    setShowPayOption(false)
  }

  const printBill = () => {
    window.print()
  }

  const createPaymentOrder = () => {
    const createPo = async () => {
      const svc = await Service.lookup(`${partner.id}:EPaymentService`)
      return svc.createPaymentOrder({
        refno,
        txntype,
        origin,
        orgcode: partner.id,
        billtoyear: bill.billtoyear,
        billtoqtr: bill.billtoqtr
      })
    }

    setLoading(true)
    setError(null)
    createPo()
      .then((po) => {
        setPo(po)
        setLoading(false)
        setMode('epayment')
      })
      .catch((err) => {
        setLoading(false)
        setError(err)
      })
  }

  if (!contact) {
    return (
      <EmailVerification showName={false} onVerify={verifyEmail} {...props} />
    )
  }

  if (mode === 'epayment') {
    return <EPayment {...props} {...{ po, partner }} />
  }

  return (
    <React.Fragment>
      <Panel visible={mode === 'initial'} style={{ maxWidth: 400 }}>
        <Label labelStyle={styles.subtitle}>Initial Information</Label>
        <Spacer />
        <Error msg={error} />
        <Text
          caption='Tax Declaration No.'
          name='refno'
          value={refno}
          onChange={setRefno}
          readOnly={loading}
        />
        <ActionBar>
          <Button
            label='Next'
            onClick={loadBill}
            loading={loading}
            disabled={loading}
          />
        </ActionBar>
      </Panel>

      <Panel visible={mode === 'viewbill'} style={{ maxWidth: 450 }}>
        <Label labelStyle={styles.subtitle}>Billing Information</Label>
        <Spacer />
        <Error msg={error} />
        <Loading visible={loading} />
        <FormPanel context={bill} handler={setBill}>
          <Text name='billno' caption='Bill No.' readOnly />
          <Text name='billdate' caption='Bill Date' readOnly />
          <Text name='tdno' caption='TD No.' readOnly />
          <Text name='fullpin' caption='PIN' readOnly />
          <Text name='taxpayer.name' caption='Property Owner' readOnly />
          <Text name='taxpayer.address' caption='Owner Address' readOnly />
          <Text name='billperiod' caption='Bill Period' readOnly />
          <Text name='amount' caption='Amount Due' readOnly />
        </FormPanel>
        <ActionBar disabled={loading}>
          <Button caption='Back' onClick={() => props.onBack()} />
          <Button caption='Print' onClick={printBill} />
          <Button caption='Pay Option' onClick={showPayOptionHandler} />
          <Button caption='Proceed for Payment' onClick={createPaymentOrder} />
        </ActionBar>

        <PayOption
          initialValue={
            bill && {
              billtoyear: bill.billtoyear,
              billtoqtr: bill.billtoqtr
            }
          }
          open={showPayOption}
          onAccept={payOptionHandler}
          onCancel={cancelPayOptionHandler}
        />
      </Panel>
    </React.Fragment>
  )
}

const styles = {
  subtitle: {
    fontSize: 16,
    fontWeight: 400,
    opacity: 0.8,
    color: 'green'
  }
}

export default RptisBillingWebController
