var paginate = 1;
var isLoading = false;
var outOfData = false;
$(function (){
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() >= $("#loadmore").offset().top + 100) {
            if (!isLoading && !outOfData){
                isLoading = true;
                paginate++;
                $("#btn-loading").show();
                loadMoreTeacher(paginate);
            }
        }
    });
})

function loadMoreTeacher(page){
    axios.get("/web-api/v1/teachers"+'?page='+page)
        .then(r=>{
            $("#printLoadMore").append(r.data);
            if (r.data.length < 2) {
                $("#printLoadMore").append(generareOutOfData());
                outOfData = true;
            }
        })
        .catch(e=>{
            toastr.error('Có lỗi xảy ra!!!');
            console.log(e);
        })
        .finally(()=>{
            $("#btn-loading").hide();
            isLoading = false;
        })
}
