import fileinput
from copy import deepcopy

input_str = (''.join(fileinput.input())).strip()
input_cards = list(map(lambda x: list(map(int, x.split('\n')[1:])), input_str.split('\n\n')))


def p1(cards):
    cards = deepcopy(cards)
    while all(map(len, cards)):
        heads = [(deck[0], i) for i, deck in enumerate(cards)]
        cards = [deck[1:] for deck in cards]
        turn = sorted(heads, reverse=True)
        won = turn[0][1]
        for card in turn:
            cards[won].append(card[0])
    won = next(deck for deck in cards if deck)
    return sum([card * (len(won) - i) for i, card in enumerate(won)])


print(p1(input_cards))


def p2(cards):
    cards = [list(deck) for deck in cards]
    rounds = set()
    while all(map(len, cards)):
        r = tuple((tuple(deck) for deck in cards))
        if r in rounds:
            won = cards[0]
            return 0, won
        rounds.add(r)
        heads = [(deck[0], i) for i, deck in enumerate(cards)]
        cards = [deck[1:] for deck in cards]
        if all(len(deck) >= heads[i][0] for i, deck in enumerate(cards)):
            subcards = [deck[:heads[i][0]] for i, deck in enumerate(cards)]
            won = p2(subcards)
            won = won[0]
            if won == 1:
                turn = reversed(heads)
            else:
                turn = heads
        else:
            turn = sorted(heads, reverse=True)
            won = turn[0][1]
        for card in turn:
            cards[won].append(card[0])
    for i, won in enumerate(cards):
        if won:
            return i, won


_, won_deck = p2(input_cards)
print(sum([card * (len(won_deck) - i) for i, card in enumerate(won_deck)]))
