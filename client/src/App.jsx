import Views from './Views';
import ColorToggle from './components/ColorToggle.jsx';
import UserContext from './components/AccountContext';
import socket from './Socket';

const App = () => {
    return (
        <div>
            <UserContext>
                <Views />
                <ColorToggle />
            </UserContext>
        </div>
    );
}

export default App;
