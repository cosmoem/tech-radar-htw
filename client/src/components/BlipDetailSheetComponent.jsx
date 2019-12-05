import React, {createRef} from "react";
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Tooltip
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import commentService from "../services/commentService";
import writeCommentService from "../services/writeCommentService";


class BlipDetailSheetComponent extends React.Component {
    wrapperRef = createRef();

    constructor(props) {
        super(props);
        this.state = {
            comments: new Array({}),
            newCommentAutor: "Jenny",
            newCommentText: "",
            newMeinung: "",
            showDiscussion: false,
            valid: false,
            clicked: false
        };
        this.addNewComment = this.addNewComment.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNewMeinung = this.handleNewMeinung.bind(this);
        this.showDiscussion = this.showDiscussion.bind(this);
        this.getDropdownStatus = this.getDropdownStatus.bind(this);
        this.getCommentsAll = async () => {
            const data = await commentService.getByRadarType(this.props.radar);
            const comments = [];
            data.map(item => {
                comments.push({
                    autor: item.autor,
                    text: item.text,
                    meinung: item.meinung,
                    zeit: item.zeit,
                    technologie: item.technologie
                })
            });
            this.setState({
                comments: comments
            })
        };
        this.getCommentsAll();
    }

    addNewComment() {
        this.setState({clicked: true});
        if (this.state.newMeinung === "" || this.state.newCommentText == "") {
            this.setState({valid: false});
        } else {
            this.setState({valid: true});
            const modifiedComments = this.state.comments;
            const timestamp = new Date().toLocaleString();
            writeCommentService.addComment({
                autor: this.state.newCommentAutor,
                text: this.state.newCommentText,
                meinung: this.state.newMeinung,
                zeit: timestamp,
                technologie: this.props.name,
                radar: this.props.radar,
            });
            modifiedComments.push({
                autor: this.state.newCommentAutor,
                text: this.state.newCommentText,
                meinung: this.state.newMeinung,
                zeit: timestamp,
                technologie: this.props.name,
                radar: this.props.radar,
            });
            this.setState({
                comments: modifiedComments,
                newCommentAutor: "Jenny", //ToDo
                newCommentText: "",
                newMeinung: ""
            });
        }
    }

    showDiscussion() {
        if (this.state.showDiscussion === true) {
            this.setState({showDiscussion: false});
        } else {
            this.setState({showDiscussion: true});
        }
    }

    handleChange(e) {
        if (e.target.value == "") {
            this.setState({valid: false})
        } else if (e.target.value != "" && this.state.newMeinung != "") {
            this.setState({valid: true})
        }
        this.setState({newCommentText: e.target.value});
    }

    handleNewMeinung(e) {
        if (e.target.value == "") {
            this.setState({valid: false})
        } else if (e.target.value != "" && this.state.newCommentText != "") {
            this.setState({valid: true})
        }
        this.setState({newMeinung: e.target.value});
    }

    getDropdownStatus() {
        let dropdown = null;
        if (this.props.ring === "einsetzen") {
            dropdown = (<select value={this.state.value} onChange={this.handleNewMeinung}>
                <option value="">Bitte Meinung angeben!</option>
                <option value="Nach schlecht verschieben">Nach schlecht verschieben</option>
                <option value="Belassen">Belassen</option>
            </select>);
        } else if (this.props.ring === "evaluieren") {
            dropdown = (<select value={this.state.value} onChange={this.handleNewMeinung}>
                <option default>Bitte Meinung angeben!</option>
                <option value="Nach gut verschieben">Nach gut verschieben</option>
                <option value="Nach schlecht verschieben">Nach schlecht verschieben</option>
            </select>);
        } else if (this.props.ring === "überdenken") {
            dropdown = (<select value={this.state.value} onChange={this.handleNewMeinung}>
                <option default>Bitte Meinung angeben!</option>
                <option value="Nach gut verschieben">Nach gut verschieben</option>
                <option value="Belassen">Belassen</option>
            </select>);
        }
        return dropdown;
    }

    render() {
        var commentListItems = this.state.comments
            .filter(comment => {
                return comment.technologie === this.props.name
            })
            .sort(function compare(a, b) {
                var partsA = a.zeit.split(', ');
                var datesA = partsA[0].split('/');
                var timeA = partsA[1].split(':');
                var dateA = new Date('20' + datesA[2], datesA[1], datesA[0], timeA[0], timeA[1], timeA[2]);

                var partsB = b.zeit.split(', ');
                var datesB = partsB[0].split('/');
                var timeB = partsB[1].split(':');
                var dateB = new Date('20' + datesB[2], datesB[1], datesB[0], timeB[0], timeB[1], timeB[2]);

                return dateA - dateB;
            })
            .map(function (item) {
                return (<div className="discussionItem">
                    <div className="discussionContainer">
                        <div className="name">{item.autor}</div>
                        <div>{item.text}</div>
                    </div>
                    <div className="discussionContainer">
                        <div></div>
                        <div>
                            <span className="meinung">Meinung: {item.meinung}</span>
                            <span className="timestamp">gesendet: {item.zeit}</span>
                        </div>
                    </div>
                 </div>
                );
            });
        let error;
        if (this.state.valid == false && this.state.clicked == true) {
            error = (<div>Bitte alle Felder ausfüllen.</div>);
        } else {
            error = ""
        }
        ;
        let discussion;
        let discussionButton;
        if (this.state.showDiscussion === true) {
            discussion = (<div>
                <div >{commentListItems}</div>
                <div>{error}</div>
                <div className="discussionContainer">
                    {this.getDropdownStatus()}
                    <span><input type="text" maxLength="500" value={this.state.newCommentText}
                           onChange={this.handleChange} className="inputText"/>
                    <Button size="large" color="primary" onClick={this.addNewComment} className="sendButton">
                        Senden
                    </Button></span>
                </div>
            </div>);
            discussionButton = (
                <Button className="diskussionButton" size="large" color="primary" onClick={this.showDiscussion}>
                    Einklappen <Icon>expand_less</Icon>
                </Button>)
        } else {
            discussion = null;
            discussionButton = (
                <Button className="diskussionButton" size="large" color="primary" onClick={this.showDiscussion}>
                    Diskussion anzeigen <Icon>expand_more</Icon>
                </Button>)
        }

        // useOutsideAlerter(wrapperRef);
        return (
            <div ref={this.wrapperRef} id="blip-detail-sheet">
                <Card className="dialog blip-detail-sheet ">
                    <CardActions>
                        <div id="blip-close-mobile" className="blip-close-button-mobile">
                            {this.props.element}
                        </div>
                    </CardActions>
                    <CardMedia title={this.props.name} className="cardBody"></CardMedia>
                    <CardContent>
                        <div className="blip-header">
                            <h2>{this.props.name}</h2>
                            <Button size="large" color="primary">
                                <Tooltip title="Merge 'n Commit!">
                                    <Icon>favorite</Icon>
                                </Tooltip>
                            </Button>
                            <h3>{this.props.ring} | {this.props.radar}</h3>
                        </div>

                        <div className="desc">{this.props.desc}</div>
                        {discussionButton}

                        {discussion}
                    </CardContent>
                </Card>
            </div>
        );
    }
}


export default BlipDetailSheetComponent;