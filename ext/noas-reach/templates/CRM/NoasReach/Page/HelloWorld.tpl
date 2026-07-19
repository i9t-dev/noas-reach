{* This is a Smarty template *}
<div id="noas-reach-hello-world-container"></div>

<script src="{$extensionUrl}/js/dist/noas-reach-helloworld.js"></script>

<script>
  // Initialize the React component when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof initHelloWorld === 'function') {
      console.log("Init hello-world function found")
      initHelloWorld('noas-reach-hello-world-container', { name: 'CiviCRM' });
    } else {
      console.log("Init hello-world function missing")
    }
  });
</script>