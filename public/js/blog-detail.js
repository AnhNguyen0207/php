function deleteBlog(blog_id, move_to="blog") {
    axios.delete('/web-api/auth/v1/blogs/'+blog_id)
        .then(function (res){
            quickToastMixin("success", "Đã xóa blog");
            window.location.href = "/" + move_to;
        })
        .catch(function (e) {
            console.log(e)
        });
}
