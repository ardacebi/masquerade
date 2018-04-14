import icon from 'flarum/helpers/icon';
import BaseField from 'flagrow/masquerade/types/BaseField';

export default class BooleanField extends BaseField {
    editorInput() {
        return this.options().map(option => m('div', m('label', [
            m('input[type=radio]', {
                checked: option.selected(this.value()),
                onclick: () => {
                    this.set(option.key);
                },
            }),
            ' ' + option.label,
        ])));
    }

    options() {
        let options = [];

        if (!this.readAttribute(this.field, 'required')) {
            options.push({
                selected: value => BaseField.isNoOptionSelectedValue(value),
                key: null,
                label: app.translator.trans('flagrow-masquerade.forum.fields.select.none-optional'),
            });
        }

        options.push({
            selected: value => ['true', '1', 1, true, 'yes'].indexOf(value) !== -1,
            key: 'true',
            label: app.translator.trans('flagrow-masquerade.forum.fields.boolean.yes'),
        });

        options.push({
            selected: value => ['false', '0', 0, false, 'no'].indexOf(value) !== -1,
            key: 'false',
            label: app.translator.trans('flagrow-masquerade.forum.fields.boolean.no'),
        });

        // This is probably overkill because it looks like the backend casts the value anyway
        if (!BaseField.isNoOptionSelectedValue(this.value()) && ['true', '1', 1, true, 'yes', 'false', '0', 0, false, 'no'].indexOf(this.value()) === -1) {
            options.push({
                selected: () => true,
                key: this.value(),
                label: '(invalid) ' + this.value(),
            });
        }

        return options;
    }

    answerContent() {
        return [1, '1', true, 'true', 'yes'].indexOf(this.value()) !== -1 ?
            icon('check-square-o') :
            icon('square-o');
    }
}