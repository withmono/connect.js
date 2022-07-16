## Link account
Link a user account
```html
<template>
  <button @click="connectInstance.open()">
    Link account with Mono
  </button>
</template>

<script>
import Connect from '@mono.co/connect.js'
  
export default {
  data() {
    return {
      connectInstance: null
    }
  },
  created() {
    this.connectInstance = new Connect({
      key: 'PUBLIC_KEY',
      onLoad: () => console.log('Widget loaded successfully'),
      onClose: () => console.log('Widget closed'),
      onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`),
    })
    this.connectInstance.setup()
  }
}
</script>
```
## Reauthorisation 

You can reauthorise a user acount if required. Using the `reauthorise()` function. 

- Note, the `reauthorise()` function should be used in place of the `setup()` function. The two should not be used at the same time.

See example below;
```html
<template>
  <button @click="reauthoriseAccount">
    Reauthorise user account
  </button>
</template>

<script>
import Connect from '@mono.co/connect.js'
  
export default {
  data() {
    return {
      connectInstance: null
    }
  },
  created() {
    this.connectInstance = new Connect({
      key: 'PUBLIC_KEY',
      onLoad: () => console.log('Widget loaded successfully'),
      onClose: () => console.log('Widget closed'),
      onSuccess: ({ code }) => console.log(`Linked successfully: ${code}`),
    })
  },
  methods: {
    reauthoriseAccount() {
      const reauth_token = "code_xyzUi8olavk";
      this.connectInstance.reauthorise(reauth_token);
      this.connectInstance.open();
    }
  }
}
</script>
```
## Direct Debit
Charge an account `onetime-debit` or `recurring-debit`.
```html
<template>
  <button @click="connectInstance.open()">
    Pay with Mono
  </button>
</template>

<script>
import Connect from '@mono.co/connect.js'
  
export default {
  data() {
    return {
      connectInstance: null
    }
  },
  created() {
    this.connectInstance = new Connect({
      key: 'PUBLIC_KEY',
      scope: 'payments',
      data: {
        type: 'onetime-debit', // onetime-debit || recurring-debit
        amount: 120000, // amount in kobo
        description: "Payment for Netflix",
      },
      onSuccess: (chargeObject) => console.log('Charged successfully', chargeObject)
    })
    this.connectInstance.setup()
  }
}
</script>
```
