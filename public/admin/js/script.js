
$(document).ready(function() {
    $('.btnremove').on('click', function() {
      console.log("Delete Requset");
      var userId = $(this).attr('data-id');
      $.ajax({
         method: "POST",
         url: '/agent/delete',
         data: {"userId": userId},
         success: function(result) {
            if(result) {
               location.reload();
            }
         }
      })
    });

    $('.adminremove').on('click', function() {
      console.log("Delete Requset");
      var companyId = $(this).attr('data-id');
      $.ajax({
         method: "POST",
         url: '/admin/company/delete',
         data: {"companyId": companyId},
         success: function(result) {
            if(result) {
               location.reload();
            }
         }
      })
    });

});

