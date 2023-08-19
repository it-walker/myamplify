import './App.css';
import '@aws-amplify/ui-react/styles.css'

import { withAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify'

import aws_exports from './aws-exports'
import { DynamoDB } from './components/DynamoDB'

Amplify.configure(aws_exports)

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DynamoDB/>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
