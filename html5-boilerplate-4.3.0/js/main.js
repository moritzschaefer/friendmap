function main() {
  FB.api('/362342307175776', function(doc) {
    $('#docText').html(doc.message);
    alert('loaded');
  });
}
