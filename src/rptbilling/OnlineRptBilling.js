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
  Title,
  Decimal,
  BackLink
} from 'rsi-react-web-components'

import PayOption from '../components/PayOption'

const txntype = 'rptcol'
const origin = 'filipizen'

const OnlineRptBilling = (props) => {
  const [mode, setMode] = useState('initial')
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [refno, setRefno] = useState()
  const [showPayOption, setShowPayOption] = useState(false)
  const [bill, setBill] = useState()
  const [year, setYear] = useState()
  const [qtr, setQtr] = useState()
  const [barcode, setBarcode] = useState()

  const { partner, page, onCancel, onSubmit } = props

  const getBilling = async (billOptions = {}) => {
    const svc = await Service.lookupAsync(`${partner.id}:EPaymentService`)
    const params = { txntype, refno, ...billOptions }
    return await svc.getBilling(params)
  }

  const loadBill = (billOptions = {}) => {
    setLoading(true);
    setError(null);
    getBilling(billOptions).then(bill => {
      setBill(bill.info);
      setBarcode(`56001:${bill.info.billno}`);
      setMode('viewbill');
      setLoading(false)
    }).catch(err => {
      setError(err.toString());
      setLoading(false)
    })
  }

  const payOptionHandler = (billOption) => {
    setShowPayOption(false)
    loadBill(billOption)
  }

  const printBill = () => {
    window.print()
  }

  const confirmPayment = () => {
    onSubmit({
      refno,
      txntype,
      origin,
      orgcode: partner.id,
      billtoyear: bill.billtoyear,
      billtoqtr: bill.billtoqtr,
      paidby: bill.paidby,
      paidbyaddress: bill.paidbyaddress,
      amount: bill.amount,
      paymentdetails: `Real Property TD No. ${bill.tdno} ${bill.billperiod}`,
    })
  }

  return (
    <React.Fragment>
      <Title>{page.title}</Title>
      <Panel visibleWhen={mode === 'initial'}>
        <Label labelStyle={styles.subtitle}>Initial Information</Label>
        <Spacer />
        <Error msg={error} />
        <Text
          caption='Tax Declaration No.'
          name='refno'
          value={refno}
          onChange={setRefno}
          readOnly={loading}
          autoFocus={true}
        />
        <ActionBar>
          <Button caption='Back' variant="text" action={onCancel} />
          <Button caption='Next' action={loadBill} loading={loading} disabled={loading} />
        </ActionBar>
      </Panel>

      <Panel visibleWhen={mode === 'viewbill'} >
        <Label labelStyle={styles.subtitle}>Billing Information</Label>
        <Spacer />
        <Error msg={error} />
        {/* <Loading visible={loading} /> */}
        <FormPanel context={bill} handler={setBill}>
          <Text name='billno' caption='Bill No.' readOnly />
          <Text name='billdate' caption='Bill Date' readOnly />
          <Text name='tdno' caption='TD No.' readOnly />
          <Text name='fullpin' caption='PIN' readOnly />
          <Text name='taxpayer.name' caption='Property Owner' readOnly />
          <Text name='taxpayer.address' caption='Owner Address' readOnly />
          <Text name='billperiod' caption='Bill Period' readOnly />
          <Decimal name='amount' caption='Amount Due' readOnly textAlign="left" />
        </FormPanel>
        <ActionBar disabled={loading}>
          <BackLink caption='Back' action={() => props.onBack()} />
          <Panel row>
            <Button caption='Print' action={printBill} variant="outlined" />
            <Button caption='Pay Option' action={() => setShowPayOption(true)} variant="outlined" />
            <Button caption='Confirm Payment' action={confirmPayment} />
          </Panel>
        </ActionBar>

        <PayOption
          initialValue={
            bill && {
              billtoyear: bill.billtoyear,
              billtoqtr: bill.billtoqtr,
              fromyear: bill.fromyear,
            }
          }
          open={showPayOption}
          onAccept={payOptionHandler}
          onCancel={() => setShowPayOption(false)}
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

export default OnlineRptBilling
