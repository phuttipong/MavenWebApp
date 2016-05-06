/**
 * Created by phuttipong on 6/5/2559.
 */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {Container} from 'flux/utils';
import AutoSuggest from 'react-autosuggest';
import AirportStore from './stores/AirportStore';
import AirportActionCreators from './actions/AirportActionCreators';
class App extends Component {

    getSuggestions(event, {newValue}) {
        const escapedInput = newValue.trim().toLowerCase();
        const airportMatchRegex = new RegExp('\\b' + escapedInput, 'i');
        const inputLength = escapedInput.length;

        return inputLength === 0 ? [] : this.state.airports
            .filter(airport => airportMatchRegex.test(airport.city))
            .sort((airport1, airport2) => {
                return airport1.city.toLowerCase().indexOf(escapedInput)
                    - airport2.city.toLowerCase().indexOf(escapedInput);
            })
            .slice(0, 7);
    }

    getSuggestionValue(suggestion) { // when suggestion selected, this function tells
        return suggestion.city;                 // what should be the value of the input
    }

    renderSuggestion(suggestion) {
        return (
            <span>{suggestion.city} - {suggestion.country} {suggestion.code}</span>
        );
    }

    componentDidMount() {
        AirportActionCreators.fetchAirports();
    }

    render() {
        return (
            <div>
                <header>
                    <div className="header-brand">
                        <img src="logo.png" height="35"/>
                        <p>Check discount ticket prices and pay using your AirCheap points</p>
                    </div>
                    <div className="header-route">
                        <AutoSuggest id='origin'
                                     suggestions={[]}
                                     getSuggestionValue={this.getSuggestionValue}
                                     renderSuggestion={this.renderSuggestion}
                                     inputProps={
                                     {
                                        placeholder:'From',
                                        value:'',
                                        onChange:this.getSuggestions.bind(this)}
                                     }/>
                        <AutoSuggest id='destination'
                                     suggestions={[]}
                                     getSuggestionValue={this.getSuggestionValue}
                                     renderSuggestion={this.renderSuggestion}
                                     inputProps={
                                     {
                                        placeholder:'To',
                                        value:'',
                                        onChange:this.getSuggestions.bind(this)}
                                     }/>
                    </div>
                </header>
            </div>
        );
    }
}
App.getStores = () => ([AirportStore]);
App.calculateState = (prevState) => ({
    airports: AirportStore.getState()
});
const AppContainer = Container.create(App);
render(<AppContainer />, document.getElementById('root'));