$(document).search(".search-field");
$(document).on('addedSearchToken', function(e){ $('.search-field .token.added').find('input').focus(); });