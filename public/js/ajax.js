// New comment
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

// Edit comment
$('#comment-list').on('click', ".edit-button", function(){
    $(this).siblings('.edit-comment-form').toggle();
});
$('#comment-list').on('submit', '.edit-comment-form', function(e){
    e.preventDefault();

    const commentItem = $(this).serialize();
    const actionUrl = $(this).attr('action');
    $originalComment = $(this).parent();

    $.ajax({
        url: actionUrl,
        data: commentItem,
        type: 'PUT',
        originalComment: $originalComment,
        success: function(data){
            this.originalComment.html(
                `
                    <div class="comment-body">
                        ${data.text}
                    </div>
                    <div class="comment-author">
                        - <em> ${data.author.username}</em>
                    </div>
                    <form action="${actionUrl}" method="post" class="pure-form pure-form-stacked edit-comment-form">
                        <fieldset>
                            <label for="debateContent">Discuss</label>
                            <textarea class="form-control" name="comment[text]" id="debateContent" cols="30" rows="10" placeholder="Write your argument here">${data.text}</textarea>
            
                            <button class="submit-button" type="submit" name="createPost">update</button>
                        </fieldset>
                    </form>
                    <button class="pure-button edit-button" id="edit-comment">EDIT COMMENT</button>
                    <form class="delete-comment-form" action="${actionUrl}?_method=DELETE" method="POST">
                        <input class="pure-button" id="delete-comment-button" type="submit" value="DELETE">
                    </form>
                `
            );
        }
    });
});

// Delete comment
$("#comment-list").on('submit', ".delete-comment-form", function(e){
    e.preventDefault();
    const confirmResponse = confirm('Are you sure you want to delete this comment?');

    if(confirmResponse){
        const actionUrl = $(this).attr('action');
        $commentToDelete = $(this).closest('.comment-item');
        $.ajax({
            url: actionUrl,
            type: 'Delete',
            commentToDelete: $commentToDelete,
            success: function(data){
                this.commentToDelete.remove();
            }
        })
    } else {

    }
});