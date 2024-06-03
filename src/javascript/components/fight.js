import controls from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const firstFighterHealthBar = document.getElementById('left-fighter-indicator');
        const secondFighterHealthBar = document.getElementById('right-fighter-indicator');
        const pressedKeys = new Set();
        const firstFighterState = {
            fighter: firstFighter,
            health: firstFighter.health,
            isBlocking: false,
            canPerformCriticalHit: true
        };

        const secondFighterState = {
            fighter: secondFighter,
            health: secondFighter.health,
            isBlocking: false,
            canPerformCriticalHit: true
        };

        function updateHealthBars() {
            firstFighterHealthBar.style.width = `${(firstFighterState.health / firstFighter.health) * 100}%`;
            secondFighterHealthBar.style.width = `${(secondFighterState.health / secondFighter.health) * 100}%`;
        }

        function getDamage(attacker, defender) {
            const damage = getHitPower(attacker) - getBlockPower(defender);
            return damage > 0 ? damage : 0;
        }

        function getHitPower(fighter) {
            const criticalHitChance = Math.random() + 1;
            return fighter.attack * criticalHitChance;
        }

        function getBlockPower(fighter) {
            const dodgeChance = Math.random() + 1;
            return fighter.defense * dodgeChance;
        }

        function handleAttack(attacker, defender) {
            if (!defender.isBlocking) {
                const damage = getDamage(attacker.fighter, defender.fighter);
                defender.health -= damage;
                updateHealthBars();

                if (defender.health <= 0) {
                    resolve(attacker.fighter);                  
                }
            }
        }

        function handleCriticalHit(attacker, defender) {
            if (attacker.canPerformCriticalHit) {
                defender.health -= 2 * attacker.fighter.attack;
                updateHealthBars();

                attacker.canPerformCriticalHit = false;
                setTimeout(() => {
                    attacker.canPerformCriticalHit = true;
                }, 10000);

                if (defender.health <= 0) {
                    resolve(attacker.fighter);
                }
            }
        }

        function handleKeyPress(event) {
            pressedKeys.add(event.code);
            const playerOneCombinationPressed = controls.PlayerOneCriticalHitCombination.every(key =>
                pressedKeys.has(key)
            );
            const playerTwoCombinationPressed = controls.PlayerTwoCriticalHitCombination.every(key =>
                pressedKeys.has(key)
            );

            switch (true) {
                case playerOneCombinationPressed:
                    handleCriticalHit(firstFighterState, secondFighterState);
                    break;
                case playerTwoCombinationPressed:
                    handleCriticalHit(secondFighterState, firstFighterState);
                    break;
                default:
                    switch (event.code) {
                        case controls.PlayerOneAttack:
                            if (!firstFighterState.isBlocking) {
                                handleAttack(firstFighterState, secondFighterState);
                            }
                            break;
                        case controls.PlayerTwoAttack:
                            if (!secondFighterState.isBlocking) {
                                handleAttack(secondFighterState, firstFighterState);
                            }
                            break;
                        case controls.PlayerOneBlock:
                            firstFighterState.isBlocking = true;
                            break;
                        case controls.PlayerTwoBlock:
                            secondFighterState.isBlocking = true;
                            break;
                    }
                    break;
            }
        }

        function handleKeyUp(event) {
            switch (event.code) {
                case controls.PlayerOneBlock:
                    firstFighterState.isBlocking = false;
                    break;
                case controls.PlayerTwoBlock:
                    secondFighterState.isBlocking = false;
                    break;
            }
            pressedKeys.delete(event.code);
        }

        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('keyup', handleKeyUp);
    });
}
