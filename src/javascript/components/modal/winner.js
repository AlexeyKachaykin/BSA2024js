import { showWinnerModal } from './modal';

fight(firstFighter, secondFighter).then(winner => {
    showWinnerModal(winner);
});
