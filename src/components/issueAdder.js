import React, { useState } from 'react';
import { Input } from 'antd';
import './issueAdder.css';

// ant assumes a input + submit button is a search
const SubmitableInput = Input.Search;

function IssueAdder({ enabled, onAdd }) {
  const [issueName, setIssueName] = useState('');

  const clear = () => {
    setIssueName('');
  }

  const handleChange= (event) => {
    setIssueName(event.target.value);
  }
  const handleAdd = (name) => {
    if (name) {
      onAdd({ name });
    }
    clear();
  }

  return (
    <SubmitableInput
      autoFocus
      className='issueAdder'
      disabled={!enabled}
      enterButton='Add'
      onChange={handleChange}
      onSearch={handleAdd}
      placeholder="ISSUE-123"
      value={issueName}
    />
  );
}

export default IssueAdder;
