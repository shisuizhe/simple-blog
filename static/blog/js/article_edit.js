// 编辑文章
var articleInfo = $("#article-info");
$("#id_title").val(articleInfo.attr("art-title"));
$("#id_editor").val(articleInfo.attr("art-content"));
var categoryId = articleInfo.attr("art-category-id");
$("input[type='radio']").each(function () {
    if ($(this).val() == categoryId) {
        $(this).attr("checked", "checked")
    }
});
var tagList = articleInfo.attr("art-tag-list");
$("input[type='checkbox']").each(function () {
    if (tagList.includes($(this).val())) {
        $(this).attr("checked", "checked")
    }
});

// 判断checkbox是否被选中
$("input[type='checkbox']").click(function () {
    if ($(this).attr("checked") == "checked"){
        $(this).removeAttr("checked")
    }else {
        $(this).attr("checked", "checked")
    }
});

KindEditor.ready(function (K) {
    window.editor = K.create("#id_editor", {
        width: "100%",
        minHeight: 400,
        resizeType: 0,
        items: [
        "source", "undo", "redo", "preview", "code", "cut", "copy", "paste", "plainpaste",
        "justifyleft", "justifycenter", "justifyright",
        "justifyfull", "insertorderedlist", "insertunorderedlist", "indent", "outdent", "subscript",
        "superscript", "selectall", "|", "fullscreen", "/",
        "formatblock", "fontname", "fontsize", "|", "forecolor", "hilitecolor", "bold",
        "italic", "underline", "strikethrough", "lineheight", "removeformat", "|", "image",
        "table", "hr", "emoticons",
        "anchor", "link", "unlink", "|", "about"
        ],
        uploadJson: "/blog/upload/",
        extraFileUploadParams: {
            csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").val()
        },
        filePostName: "image"
    });

    // 发布文章
    $(".btn").click(function () {
        var articleId = $("#article-info").attr("art-id");
        var articleTitle = $("#id_title").val();
        var articleContent = editor.html();
        var articleCategory = $("input[type='radio']:checked").val();
        var articleTgs = [];
        $("input[type='checkbox']:checked").each(function () {
            articleTgs.push($(this).val())
        });
        if (articleTitle.trim() == "") {
            swal("标题不能为空")
        }else {
            $.ajax({
                url: "/blog/article/add/",
                type: "post",
                data: {
                    csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").val(),
                    id: articleId,
                    title: articleTitle,
                    content: articleContent,
                    category: articleCategory,
                    tags: JSON.stringify(articleTgs)
                },
                success: function (rep) {
                    if (rep.code == 1000) {
                        swal({
                            title: "添加文章成功",
                            type: "success",
                            closeOnConfirm: true,
                            confirmButtonText: "确认",
                            confirmButtonClass: "btn-success"
                        },
                        function () {
                            location.href = "/blog/backend/"
                        });
                    }else if (rep.code == 1001) {
                        swal(rep.error)
                    }else {
                        swal(rep.error)
                    }
                }
            })
        }
    });
});




