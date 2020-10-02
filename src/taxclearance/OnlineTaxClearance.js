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

const txntype = 'rpttaxclearance'
const origin = 'filipizen'

const OnlineTaxClearance = (props) => {
  const [mode, setMode] = useState('initial')
  const [error, setError] = useState()
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  //TODO: REMOVE TEST
  // const [refno, setRefno] = useState("L-0001")
  // const [purpose, setPurpose] = useState("LOAN")
  const [refno, setRefno] = useState()
  const [purpose, setPurpose] = useState()
  const [clearance, setClearance] = useState({})

  const { partner, page, onCancel, onSubmit } = props

  const getClearance = async () => {
    const svc = await Service.lookupAsync(`${partner.id}:OnlineRealtyTaxClearanceService`)
    const params = { txntype, refno, purpose }
    return await svc.getBilling(params)
  }

  const validated = () => {
    if (!refno) setErrors({...errors, refno: "Tax Declaration No. is required."})
    if (!purpose) setErrors({...errors, purpose: "Purpose is required."})
    return Object.keys(errors).length === 0;
  }

  const loadClearance = () => {
    if (validated()) {
      setLoading(true);
      setError(null);
      getClearance().then(clearance => {
        setClearance(clearance);
        setMode('view');
        setLoading(false)
      }).catch(err => {
        setError(err.toString());
        setLoading(false)
      })
      setErrors({})
    }
  }

  const confirmPayment = () => {
    onSubmit({
      refno,
      txntype,
      origin,
      orgcode: partner.id,
      paidby: clearance.paidby,
      paidbyaddress: clearance.paidbyaddress,
      amount: clearance.amount,
      particulars: `Realty Tax Clearance for TD No. ${clearance.tdno}`,
      items: clearance.billitems,
      info: {data: clearance}
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
          error={errors.refno}
          helperText={errors.refno}
        />
        <Text
          caption='Purpose'
          name='purpose'
          value={purpose}
          onChange={setPurpose}
          readOnly={loading}
          error={errors.purpose}
          helperText={errors.purpose}
        />
        <ActionBar>
          <Button caption='Back' variant="text" action={onCancel} />
          <Button caption='Next' action={loadClearance} loading={loading} disabled={loading} />
        </ActionBar>
      </Panel>

      <Panel visibleWhen={mode === 'view'} style={{maxWidth: 400}}>
        <Label labelStyle={styles.subtitle}>Clearance Information</Label>
        <Spacer />
        <Error msg={error} />
        <FormPanel context={clearance} handler={setClearance}>
          <Text name='tdno' caption='TD No.' readOnly />
          <Text name='pin' caption='PIN' readOnly />
          <Text name='owner.name' caption='Property Owner' readOnly />
          <Text name='owner.address' caption='Owner Address' readOnly />
          <Text name='purpose' caption='Purpose' readOnly />
          <Spacer />
          <Decimal name='amount' caption='Amount Due' readOnly textAlign="left" />
        </FormPanel>
        <ActionBar disabled={loading}>
          <BackLink caption='Back' action={() => props.onBack()} />
          <Button caption='Confirm Payment' action={confirmPayment} />
        </ActionBar>
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

export default OnlineTaxClearance
