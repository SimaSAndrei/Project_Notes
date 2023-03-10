import React, { Component } from 'react';

import User from '../components/User';
import New from './New';
import NotesList from './NotesList';
import BooksList from './BooksList';
import SharedList from './SharedList';
import NotesStore from '../stores/NotesStore';
import SharedStore from '../stores/SharedStore';
import UserStore from '../stores/UserStore';
import CODES from '../codes.json';
import BooksStore from '../stores/BooksStore';

class Menu extends Component {

   
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.id,
            name: this.props.name, 
            email: this.props.email, 
            selected: {
                id: this.props.id,
                type: this.props.type
            },
            classes: "disabled"
        }

        this.store = null;

        this.handleLogin = async (value) => {
            if (value > 0) {
                this.store = new UserStore();
                this.store.getUserById(value);
                this.store.emitter.addListener(CODES.CODE_GET_USER_BY_ID,  () => {
                    this.setState({
                        id: this.store.user.id,
                        name: this.store.user.name,
                        email: this.store.user.email
                    }) 
                });

                
            } else {
                await this.setState({
                    id: 0,
                    name: '',
                    email: ''
                })
            }
           this.props.onLogin(value);    
        }

        this.handleSelect = async (selectedId, selectedType) => {
            this.props.onSelect(selectedId, selectedType);
            await this.setState({
                selected: {
                    type: selectedType,
                    id: selectedId
                }
            });
        }


        this.createBook = async () => {
            this.store = new BooksStore(this.state.id);
            let name = document.querySelector('#addNewBookName').value;
            let book = await this.store.create({
                name: name
            });
            this.props.onSelect(book.id, 'book');
            this.setState({
                classes: "disabled"
            });
            document.querySelector('#addNewBookName').value = '';
        }

        this.cancelCreateBook = () => {
            this.setState({
                classes: "disabled"
            });
        }

        this.handleCreate = async (value) => {
            switch(value) {
                case "note":
                    this.store = new NotesStore(this.state.id);
                    let note = await this.store.create({
                        title: '',
                        content: ''
                    });
                    this.props.onSelect(note.id, 'notes');
                    break;
                case "shared":
                    this.store = new SharedStore(this.state.id);
                    let shared = await this.store.create({
                        title: '',
                        content: ''
                    });
                    this.props.onSelect(shared.id, 'shared');
                    break;
                case "book":
                    await this.setState({
                        classes: "enabled"
                    });
                    break;
                default:
                    break;
            }
            
        }
    } 

    async componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
             this.setState({
                id: this.props.id, 
                name: this.props.name, 
                email: this.props.email
            });
        } else if (this.props.update !== prevProps.update) {
            this.setState({
                update: this.props.update
            })
            console.log(this.state.update);
        }
    }


    render() {
        return (
            <div>      
                <ul id="menu" onSelect={this.handleSelect}
                className="resizable">
                    <li>
                    <img id="noteslogo" src="https://i.imgur.com/IoUXaKo.png" alt="notes logo"/>
                    </li>
                    <li>
                     <User id={this.state.id} 
                        name={this.state.name}
                        email={this.state.email}
                        onLogin={this.handleLogin}/>
                    </li>
                    {/* <li>
                        <input id="search" type="text" placeholder="Search" onChange={this.handleSearch}/>
                    </li> */}
                    <li>
                        <New  id={this.state.id} onCreate={this.handleCreate}/>
                        <div id="addNewBookForm" className={this.state.classes}>
                            <input id="addNewBookName" type="text" placeholder="Type the book's name ... " />
                            <input id="addNewBookSave" type="button" value="Save" onClick={this.createBook}/>
                            <input id="addNewBookCancel" type="button" value="Cancel" onClick={this.cancelCreateBook}/>
                        </div>
                    </li>
                    <li>
                        <NotesList update={this.state.update} id={this.state.id} onSelect={this.handleSelect}/>
                    </li>
                    <li>
                        <BooksList id={this.state.id} onSelect={this.handleSelect}/>
                    </li>
                    <li>
                        <SharedList id={this.state.id} onSelect={this.handleSelect}/>
                    </li>
                </ul> 
            </div>
        )
    }
}

export default Menu;