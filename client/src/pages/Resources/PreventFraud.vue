<template>
  <q-page class="flex justify-center">
    <div class="mainDocumentContainer">
        <div class="readFont q-mt-lg">
           The Utah Gun Hub Team works hard to keep the site free from scammers and spam. Despite this, we've included a list of ways you can protect yourself from scam.
        </div>
      <div class="readFont q-mt-lg">
        <ol>
          <li>
            Don’t send any money to anyone in advance unless you are certain of their identity and credibility.
          </li>
          <li>
            Don’t send any ID or personal information to anyone in advance unless you are certain of their identity and credibility.
          </li>
          <li>
            Remember that “if it sounds too good to be true then it probably is”.
          </li>
          <li>
            If the other party claims to be unavailable or out of town then be extra careful.
          </li>
          <li>
            If the seller or buyer “only texts” then be extra careful.
          </li>
          <li>
            If the seller “only ships” then be extra careful.
          </li>
          <li>
            Meet in what you consider to be a secure location with good visibility.
          </li>
          <li>
            Verify the item is exactly what you want before you pay for it.
          </li>
          <li>
            Ask for a bill of sale and verify the identity and residency of the buyer or seller.
          </li>
          <li>
            Transact only with residents of the state in which you reside.
          </li>
          <li>
            Verify method of payment is authentic before completing a transaction.
          </li>
        </ol>
      </div>
    </div>
  </q-page>
</template>

<script>
  export default {
    name: 'PreventFraud',
    data(){
      return {
      }
    }
  };
</script>

<style scoped>
  .mainDocumentContainer {
    display: flex;
    min-width: 350px;
    max-width: 800px;
    width: 100%;
    flex-direction: column;
  }

  .readFont {
    font-family: "KuchekLight", Times, Serif;
    line-height: 1.6em;
    font-size: 1.3em;
    font-weight: 100;
    text-align: center;
  }

</style>
