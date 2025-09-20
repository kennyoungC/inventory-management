import { SelectOption } from '@/utils/measureUnits';
import React, { CSSProperties } from 'react';
import Select, { GroupBase, StylesConfig } from 'react-select';

const groupStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

const groupBadgeStyles: CSSProperties = {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'inventory',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
};

// Properly typed custom styles
const customStyles: StylesConfig<SelectOption, false, GroupBase<SelectOption>> = {
    control: (styles, { isFocused, isDisabled }) => ({
        ...styles,
        minHeight: '38px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        backgroundColor: isDisabled ? '#f9fafb' : '#ffffff',
        boxShadow: isFocused
            ? '0 1px 2px 0 rgb(0 0 0 / 0.05), 0 0 0 1px #3b82f6'
            : '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        borderColor: isFocused ? '#3b82f6' : '#d1d5db',
        '&:hover': {
            borderColor: isFocused ? '#3b82f6' : '#d1d5db',
        },
        fontSize: '14px',
        padding: '0',
        marginTop: '4px',
    }),
    valueContainer: styles => ({
        ...styles,
        padding: '8px 12px',
    }),
    input: styles => ({
        ...styles,
        margin: '0',
        padding: '0',
        fontSize: '14px',
    }),
    indicatorSeparator: styles => ({
        ...styles,
        display: 'none',
    }),
    dropdownIndicator: styles => ({
        ...styles,
        padding: '8px',
        color: '#6b7280',
        '&:hover': {
            color: '#6b7280',
        },
    }),
    placeholder: styles => ({
        ...styles,
        color: '#9ca3af',
        fontSize: '14px',
    }),
    menu: styles => ({
        ...styles,
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        marginTop: '4px',
    }),
    option: (styles, { isFocused, isSelected }) => ({
        ...styles,
        backgroundColor: isSelected ? '#3b82f6' : isFocused ? '#f3f4f6' : 'transparent',
        color: isSelected ? '#ffffff' : '#374151',
        fontSize: '14px',
        padding: '8px 12px',
        '&:hover': {
            backgroundColor: isSelected ? '#3b82f6' : '#f3f4f6',
        },
    }),
    singleValue: styles => ({
        ...styles,
        color: '#374151',
        fontSize: '14px',
    }),
    multiValue: styles => ({
        ...styles,
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
    }),
    multiValueLabel: styles => ({
        ...styles,
        color: '#374151',
        fontSize: '12px',
    }),
    multiValueRemove: styles => ({
        ...styles,
        color: '#6b7280',
        '&:hover': {
            backgroundColor: '#ef4444',
            color: '#ffffff',
        },
    }),
    // Group styling
    group: styles => ({
        ...styles,
        paddingTop: '8px',
        paddingBottom: '8px',
    }),
    groupHeading: styles => ({
        ...styles,
        fontSize: '12px',
        fontWeight: '600',
        color: '#374151',
        textTransform: 'none',
        marginBottom: '4px',
        padding: '4px 12px',
    }),
};

// Type guard to check if options are grouped
const isGroupedOptions = (
    options: SelectOption[] | GroupBase<SelectOption>[],
): options is GroupBase<SelectOption>[] => {
    return options.length > 0 && 'options' in options[0];
};

const formatGroupLabel = (group: GroupBase<SelectOption>) => (
    <div style={groupStyles}>
        <span>{group.label ?? ''}</span>
        <span style={groupBadgeStyles}>{group.options.length}</span>
    </div>
);

type Props = {
    label?: string;
    name?: string;
    error?: string;
    required?: boolean;
    options: SelectOption[] | GroupBase<SelectOption>[];
    defaultValue?: SelectOption | null;
    onChange?: (option: SelectOption | null) => void;
    placeholder?: string;
    isDisabled?: boolean;
    isMulti?: boolean;
};

const SelectInput = ({
    label,
    error,
    required,
    name,
    options,
    defaultValue,
    onChange,
    placeholder,
    isDisabled = false,
    // isMulti = false,
}: Props) => {
    const inputId = `${name}-select`;
    const isGrouped = isGroupedOptions(options);

    return (
        <div>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            <Select<SelectOption, false, GroupBase<SelectOption>>
                inputId={inputId}
                name={name}
                options={options}
                defaultValue={defaultValue}
                onChange={onChange}
                placeholder={placeholder}
                isDisabled={isDisabled}
                // isMulti={isMulti}
                formatGroupLabel={isGrouped ? formatGroupLabel : undefined}
                styles={customStyles}
                aria-invalid={!!error}
                aria-describedby={error ? `${inputId}-error` : undefined}
            />
            {error && (
                <p id={`${inputId}-error`} className="mt-1 ml-2 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default SelectInput;
