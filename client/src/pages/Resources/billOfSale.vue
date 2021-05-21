<template>
  <q-page class="flex justify-center">
    <div class="mainDocumentContainer">
        <div class="readFont q-mt-lg">
          Under Federal law, you CANNOT sell any firearm to a person who is not a resident of Utah in a private party transaction, unless a Federal Firearms Licensee (a gun store) performs the transfer.
        </div>
      <div class="readFont q-mt-lg">
        A firearm bill of sale is a document used to record the purchase and ownership transfer of a gun. The sale of a personal firearm usually does not carry the same liability as a dealer or purchasing at a gun show. It is the responsibility of the seller to NOT allow the sale of a firearm to a convicted felon.
      </div>
      <div class="readFont q-mt-lg">
        We've provided a downloadable pdf for a bill of sale here.
      </div>
      <div class="flex justify-around q-mt-lg">

          <a :href="billOfSale" download="BillOfSale.pdf" target="_blank">
            <q-btn label="Download PDF" size="lg" push icon="far fa-file-pdf" color="primary" class="readFont">
            </q-btn>
          </a>
        <q-img :src="billOfSaleImg" style="height: 400px;width: 300px;border: 1px solid rgba(225, 225, 225, 1);" :class="$q.screen.lt.md ? 'q-mt-md' : ''"></q-img>
      </div>
    </div>
  </q-page>
</template>

<script>
  import PdfFile from '../../assets/BillOfSale/utah-firearm-bill-of-sale.pdf';
  import billImage from '../../assets/BillOfSale/billOfSalePicture.png';
  export default {
    name: 'billOfSale',
    data(){
      return {
        billOfSale: PdfFile,
        billOfSaleImg: billImage
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
