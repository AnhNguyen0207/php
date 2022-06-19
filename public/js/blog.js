var isRunning = false;
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= $('#content').height()) {
            if (!isRunning && page < total) {
                if ($("#teachersList").length){
                    loadMoreTeachers(page);
                    page++;
                    return;
                }
                loadMore(page, kind);
                page++;
            }
        }
    });

    function loadMore(page, kind) {
        isRunning = true;
        $('#loading-page').show();
        axios.get("/blog/load-more", {
            params: {
                search: search,
                tag: tag,
                category: category,
                page: page,
                kind: kind
            },
        }).then(function (response) {
            $("#loadMoreBlog").append(response.data);
            console.log('loaded');
            $('#loading-page').hide();
            isRunning = false;
        }).catch(function (error) {
            console.log('Server error occured');
            $('#loading-page').hide();
        })
    }
});


function validateSearch(event) {
    console.log();
    if ($('#search').val().length < 4) {
        toastr.error('Vui lòng nhập trên 3 kí tự!');
        event.preventDefault();
    }
}

function loadMoreTeachers(page){
    isRunning = true;
    $('#loading-page').show();
    var rand = (new Date()).getTime(); //pass in a random parameter to clear the cache

    axios.get(`/web-api/v1/teachers?page=${page}&rand=${rand}`)
        .then(r=>{
            const teachers = r.data.items;
            if (teachers.length){
                $('#loading-page').hide();
                $.each(teachers, function (index, item){
                    $("#teachersList").append(generateCardTeacher(item));
                })
            } else {
                $("#loading-page").hide();
            }

            isRunning = false;
        })
        .catch(e=>{
            $('#loading-page').hide();
            console.log(e);
        })
}

function generateCardTeacher(teacher){
    return `<div class="col-md-6 mt-4 pt-1">
        <a href="/teacher/${teacher.slug}" aria-label="dsa">
            <div class="position-relative">
                <div class="blog-img zoom" loading="lazy"
                     style="background-image: url('${teacher.thumb_url}'); padding-bottom: 40%; background-size: contain">
                </div>
            </div>
        </a>
        <div class="pt-2 mt-1 pb-1">
            <div class="d-flex align-items-center">
            </div>
        </div>
        <a href="/blog/dsa" class="blog-title text-black">
            ${teacher.title}
        </a>
    </div>`
}
