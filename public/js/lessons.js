function deleteVideo(video_id){
    axios.delete('/web-api/auth/v1/videos/' + video_id)
        .then(function (res) {
            quickToastMixin('success', 'Đã xóa video')
            $("#video-"+video_id).remove();
        }).catch(function (e) {
            console.log(e)
        })
}
