import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        const { name, health, attack, defense } = fighter;

        const imgElement = createFighterImage(fighter);
        const fighterInfo = createElement({
            tagName: 'div',
            className: 'fighter-info'
        });

        fighterInfo.innerHTML = `
            <div class="fighter-name">${name}</div>
            <div class="fighter-stat">Health: ${health}</div>
            <div class="fighter-stat">Attack: ${attack}</div>
            <div class="fighter-stat">Defense: ${defense}</div>
        `;

        fighterElement.append(imgElement, fighterInfo);
    }

    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
