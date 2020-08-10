import React, { useState } from "react";
import { Number, Select, FormPanel, Modal } from "rsi-react-web-components";

const PayOption = (props) => {
  const { initialValue = {}, open, onAccept, onCancel } = props;
  const [context, setContext] = useState(initialValue);

  const okHandler = () => {
    onAccept(context);
  };

  const qtrs = [1, 2, 3, 4];

  return (
    <Modal
      open={open}
      caption="Pay Options"
      onAccept={okHandler}
      onCancel={onCancel}
      maxWidth={100}
    >
      <FormPanel context={context} handler={setContext}>
        <Number caption="Year to Bill" name="billtoyear" />
        <Select caption="Quarter to Bill" name="billtoqtr" items={qtrs} />
      </FormPanel>
    </Modal>
  );
};

export default PayOption;
