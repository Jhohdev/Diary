import { IHeaderProps } from "./IHeaderProps";
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<{
    headerProps: {
        type: () => IHeaderProps;
        required: true;
    };
    previousYearLabel: {
        type: StringConstructor;
        default: string;
    };
    previousPeriodLabel: {
        type: StringConstructor;
        default: string;
    };
    nextPeriodLabel: {
        type: StringConstructor;
        default: string;
    };
    nextYearLabel: {
        type: StringConstructor;
        default: string;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    input: (day: Date) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    headerProps: {
        type: () => IHeaderProps;
        required: true;
    };
    previousYearLabel: {
        type: StringConstructor;
        default: string;
    };
    previousPeriodLabel: {
        type: StringConstructor;
        default: string;
    };
    nextPeriodLabel: {
        type: StringConstructor;
        default: string;
    };
    nextYearLabel: {
        type: StringConstructor;
        default: string;
    };
}>> & {
    onInput?: ((day: Date) => any) | undefined;
}, {
    previousYearLabel: string;
    previousPeriodLabel: string;
    nextPeriodLabel: string;
    nextYearLabel: string;
}, {}>, {
    label?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
