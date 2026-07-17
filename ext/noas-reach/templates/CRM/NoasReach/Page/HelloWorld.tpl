{* This is a Smarty template *}
<div id="noas-reach-hello-world-container"></div>

<script src="{$extensionUrl}/js/dist/noas-reach-helloworld.js"></script>
<script>
  // Initialize the React component when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // @ts-ignore - CRM is available in CiviCRM context
    // if (typeof CRM !== 'undefined') {
    //   CRM.loadScript('{crmURL p="civicrm/ajax/rest" q="..."}'); // Optional: load dependencies
    // }
    // @ts-ignore - initHelloWorld is exported from our module
    if (typeof initHelloWorld === 'function') {
      console.log("Init hello-world function found")
      initHelloWorld('noas-reach-hello-world-container', { name: 'CiviCRM' });
    } else {
      console.log("Init hello-world function missing")
    }
  });
</script>