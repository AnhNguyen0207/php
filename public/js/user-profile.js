
$(function (){
    if ($(location).attr("href").includes("?sortBy=views&orderBy=asc")){
        $("#sortByView").attr("href", "?sortBy=views&orderBy=desc")
    }
})

