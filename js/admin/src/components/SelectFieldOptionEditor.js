import app from 'flarum/app';
import Component from 'flarum/Component';
import icon from 'flarum/helpers/icon';

export default class SelectFieldOptionEditor extends Component {
    init() {
        this.newOption = m.prop('');
    }

    view() {
        return m('li', [
            m('label', app.translator.trans('flagrow-masquerade.admin.fields.options')),
            m('table', m('tbody', this.options().map((option, optionIndex) => m('tr', [
                m('td', m('input[type=text].FormControl', {
                    oninput: m.withAttr('value', value => {
                        this.updateOption(optionIndex, value);
                    }),
                    value: option,
                })),
                m('td', m('button.Button', {
                    onclick: () => {
                        this.moveOption(optionIndex, -1);
                    },
                }, icon('chevron-up'))),
                m('td', m('button.Button', {
                    onclick: () => {
                        this.moveOption(optionIndex, 1);
                    },
                }, icon('chevron-down'))),
                m('td', m('button.Button.Button--danger', {
                    onclick: () => {
                        this.deleteOption(optionIndex);
                    },
                }, icon('close'))),
            ])))),
            m('.helpText', app.translator.trans('flagrow-masquerade.admin.fields.option-coma-warning')),
            m('table', m('tbody'), m('tr', [
                m('td', m('input[type=text].FormControl', {
                    onchange: m.withAttr('value', this.newOption),
                    value: this.newOption(),
                    placeholder: app.translator.trans('flagrow-masquerade.admin.fields.option-new'),
                })),
                m('td', m('button.Button.Button--primary', {
                    onclick: () => {
                        this.addOption();
                    },
                }, icon('plus'))),
            ])),
        ]);
    }

    updateRules(options) {
        // We ignore other existing rules, they would probably be leftovers from another field type when changing types
        this.props.onchange('in:' + options.join(','));
    }

    options() {
        const rules = this.props.value.split('|');

        let options = [];

        rules.forEach(rule => {
            const parts = rule.split(':', 2);

            if (parts[0] === 'in') {
                options = parts[1].split(',');
            }
        });

        return options;
    }

    updateOption(index, value) {
        let options = this.options();

        options[index] = value;

        this.updateRules(options);
    }

    moveOption(index, moveIndex) {
        let options = this.options();

        const newIndex = index + moveIndex;

        if (newIndex < 0 || newIndex > options.length - 1) {
            return;
        }

        const move = options.splice(index, 1);

        options.splice(newIndex, 0, move[0]);

        this.updateRules(options);
    }

    deleteOption(index) {
        let options = this.options();

        options.splice(index, 1);

        this.updateRules(options);
    }

    addOption() {
        if (this.newOption() === '') {
            return;
        }

        let options = this.options();

        options.push(this.newOption());

        this.newOption('');

        this.updateRules(options);
    }
}
