var data = [
    { id: 1, author: "Pete Hunt", text: "This is one comment" },
    { id: 2, author: "Jordan Walke", text: "This is *another* comment" }
];

var Comment = React.createClass({
    rawMarkup() {
        let md = new Remarkable();
        let rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    },
    render() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup() } />
            </div>
        )
    }
});

var CommentList = React.createClass({
    render() {
        let commentNodes = this.props.data.map((comment) =>
            <Comment author={comment.author} key={comment.id}>
                {comment.text}
            </Comment>
        );
        return (
            <div className="commentList">
                { commentNodes }
            </div>
        );
    }
});

var CommentForm = React.createClass({
    render: () => <div className="commentForm">Hello, world!I am a Comment Form</div>
});

var CommentBox = React.createClass({
    render() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.props.data}/>
                <CommentForm />
            </div>
        )
    }
});


ReactDOM.render(
    <CommentBox url={/api/comments}/>,
    document.getElementById('content')
);