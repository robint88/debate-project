$('#new-comment-form').submit(function(e){
    e.preventDefault();

    const commentItem = $(this).serialize();
    const actionUrl = $(this).attr('action');

    $.post(actionUrl, commentItem, function(data){
        $("#comment-list").append(
            `
            <div class="comment-item">
                <div class="comment-body">
                    ${data.text}
                </div>
                <div class="comment-author">
                    - <em>${data.author.username}</em>
                </div>
            </div>
            `
        )
    $('#new-comment-form').find('#commentContent').val('');
    });
});