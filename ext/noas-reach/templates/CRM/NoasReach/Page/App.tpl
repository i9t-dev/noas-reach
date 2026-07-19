{* This is a Smarty template *}
<div id="noas-reach-container"></div>

<script src="{$extensionUrl}/js/dist/app.js"></script>

<script>
  // Initialize the React component when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof initApp === 'function') {
      console.log("App init function found")
      initApp('noas-reach-container', { name: 'Noah\'s Reach' });
    } else {
      console.log("App init function missing")
    }
  });
</script>