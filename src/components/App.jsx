import { Component } from 'react';
import { nanoid } from 'nanoid';
import Form from './Form/Form';
import FilterContacts from './FilterContacts/FilterContacts';
import ContactsList from './ContactsList/ContactsList';
import css from './App.module.css';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
    name: '',
    number: '',
  };

  handleFormSubmit = ({ name, number }) => {
    const { contacts } = this.state;
    console.log(name, number);

    if (
      contacts.find(
        contact => contact.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      alert(`${name} is already in contacts.`);
      return;
    }

    this.setState(prevState => ({
      contacts: [...prevState.contacts, { id: nanoid(), name, number }],
    }));
  };

  handleFilterChange = event => {
    this.setState({ filter: event.target.value });
  };

  getVisibleContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  handleDeleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  nameInputId = nanoid();
  numberInputId = nanoid();

  render() {
    const visibleContacts = this.getVisibleContacts();
    return (
      <>
        <div className={css.main}>
          <h2>Phonebook</h2>
          <Form onSubmit={this.handleFormSubmit} />
        </div>
        <div className={css.main}>
          <h2>Contacts</h2>
          <FilterContacts
            value={this.state.filter}
            onChange={this.handleFilterChange}
          />
          <ContactsList
            visibleContacts={visibleContacts}
            onDeleteContact={this.handleDeleteContact}
          />
        </div>
      </>
    );
  }
}
