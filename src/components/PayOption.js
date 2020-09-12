import React, { useState } from 'react'
import {
  Integer,
  Select,
  FormPanel,
  Modal,
  Combobox,
  integerRangeToArray,
  getCurrentYear,
} from 'rsi-react-web-components'

const PayOption = (props) => {
  const { initialValue = {}, open, onAccept, onCancel } = props
  const [context, setContext] = useState(initialValue)

  const okHandler = () => {
    onAccept(context)
  }

  const qtrs = [1, 2, 3, 4]
  const years = integerRangeToArray(props.initialValue.fromyear, getCurrentYear() + 3);

  return (
    <Modal
      open={open}
      caption='Pay Options'
      onAccept={okHandler}
      onCancel={onCancel}
      maxWidth={100}
    >
      <FormPanel context={context} handler={setContext}>
        <Combobox caption="Year to Bill" name="billtoyear" items={years} />
        <Select caption='Quarter to Bill' name='billtoqtr' items={qtrs} />
      </FormPanel>
    </Modal>
  )
}

export default PayOption
