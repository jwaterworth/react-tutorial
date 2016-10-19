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
    getInitialState: () => ({ author: '', text: '' }),
    handleAuthorChange(e) {
        this.setState({ author: e.target.value });
    },
    handleTextChange(e) {
        this.setState({ text: e.target.value });
    },
    handleSubmit(e) {
        e.preventDefault();
        let author = this.state.author.trim();
        let text = this.state.text.trim();

        if (!text || !author) {
            return;
        }

        this.props.onCommentSubmit({ author: author, text: text });
        this.setState({ author: '', text: '' });
    },
    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                    />
                <input type="text"
                    placeholder="Say something..."
                    value={this.state.text}
                    onChange={this.handleTextChange}
                    />
                <input type="submit" value="Post" />
            </form>
        );
    }
});

var CommentBox = React.createClass({
    loadCommentsFromServer() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: data => {
                this.setState({ data: data });
            },
            error: (xhr, status, err) => {
                console.error(this.props.url, status, err.toString());
            }
        });
    },
    handleCommentSubmit(comment) {
        let comments = this.state.data;

        comment.id = Date.now();

        let newComments = comments.concat([comment]);
        this.setState({ data: newComments });
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: data => {
                this.setState({ data: data });
            },
            error: (xhr, status, err) => {
                this.setState({ data: comments });
                console.error(this.props.url, status, err.toString());
            }
        });
    },
    getInitialState() {
        return { data: [] }
    },
    componentDidMount() {
        console.log(this);
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data}/>
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        )
    }
});


ReactDOM.render(
    <CommentBox url="/api/comments" pollInterval={2000}/>,
    document.getElementById('content')
);