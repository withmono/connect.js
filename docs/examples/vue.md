## useMono composable
Create a composable useMono.js file and paste this there
```js
//composables/useMono.js
import MonoConnect from '@mono.co/connect.js';
import { ref, unref, nextTick } from 'vue';

export default function useMono(key, success = () => {}, onEvent = () => {}) {
 const directDebitPayload = ref({});

 const monoConnect = ref(
  new MonoConnect({
   onClose: () => console.log('Widget closed'),
   onLoad: () => console.log('Widget loaded successfully'),
   ...unref(directDebitPayload),
   onEvent: (eventName, data) => onEvent(eventName, data),
   onSuccess: (data) => success(data),
   key,
  }),
 );

 const connect = async () => {
  await unref(monoConnect).setup();
  nextTick(() => unref(monoConnect).open());
 };

 const reAuthoriseAccount = async (reauthToken) => {
  await unref(monoConnect).reauthorise(reauthToken);
  nextTick(() => unref(monoConnect).open());
 };

 const directDebit = (data) => {
  directDebitPayload.value = { ...data };
  nextTick(() => connect());
 };

 return { connect, reAuthoriseAccount, directDebit };
}
```

## Link account
Link a user account
```vue
<script setup>
 import '@mono.co/connect.js';
 import useMono from './composables/useMono';

 const success = (data) => console.log(`Linked successfully: ${data}`);

 const onEvent = (eventName, data) => {
  if (eventName == 'OPENED') {
   console.log('Widget opened');
  } else if (eventName == 'INSTITUTION_SELECTED') {
   console.log(`Selected institution: ${data.institution.name}`);
  }
  console.log(eventName);
  console.log(data);
 };

 const { connect } = useMono(
  'live_pk_d2X0CSU0qIZX9AH1ZwXV',
  success,
  onEvent, // optional. unless it's required
 );
</script>

<template>
 <button @click.prevent="connect">Link account with Mono</button>
</template>
```

## Reauthorisation 

You can reauthorise a user acount if required. Using the `reAuthoriseAccount` method. 

See example below;
```vue
<script setup>
 import '@mono.co/connect.js';
 import useMono from './composables/useMono';

 const success = (data) => console.log(`Linked successfully: ${data}`);

 const onEvent = (eventName, data) => {
  if (eventName == 'OPENED') {
   console.log('Widget opened');
  } else if (eventName == 'INSTITUTION_SELECTED') {
   console.log(`Selected institution: ${data.institution.name}`);
  }
  console.log(eventName);
  console.log(data);
 };

 const { reAuthoriseAccount } = useMono(
  'PUBLIC_KEY',
  success,
  onEvent, // optional. unless it's required
 );
</script>

<template>
 <button @click.prevent="reAuthoriseAccount('code_xyzUi8olavk')">Reauthorise user account</button>
</template>
```

## Direct Debit
Charge an account `one-time-debit` or `recurring`.
```vue
<script setup>
 import '@mono.co/connect.js';
 import useMono from './composables/useMono';

 const success = (data) => console.log(`Linked successfully: ${data}`);

 const onEvent = (eventName, data) => {
  if (eventName == 'OPENED') {
   console.log('Widget opened');
  } else if (eventName == 'INSTITUTION_SELECTED') {
   console.log(`Selected institution: ${data.institution.name}`);
  }
  console.log(eventName);
  console.log(data);
 };

 const { directDebit } = useMono(
  'live_pk_d2X0CSU0qIZX9AH1ZwXV',
  success,
  onEvent, // optional. unless it's required
 );

 const debit = () =>
  directDebit({
   scope: 'payments',
   data: {
    type: 'one-time-debit', // one-time-debit || recurring-debit
    amount: 150000, // amount in kobo
    description: 'Payment for light bill',
   },
  });
</script>

<template>
 <button @click.prevent="debit">Pay with Mono</button>
</template>
```