import React, {Component} from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const defaultStyles = {
    table: {
        tableLayout: 'auto',
    },
    tbody: {
        height: 'inherit',
    },
    header: {
        th: {
            padding: 0,
        },
        'th:first-child': {
            padding: '0 0 0 12px',
        },
    },
    cell: {
        td: {
            padding: '0 12px',
            whiteSpace: 'normal',
        },
        'td:first-child': {
            padding: '0 12px 0 16px',
            whiteSpace: 'normal',
        },
    },
};

const SortableItem = SortableElement(({value}) =>
    <td>{value}</td>
);

const SortableList = SortableContainer(({items}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Date</TableHeaderColumn>
                    <TableHeaderColumn>Time</TableHeaderColumn>
                    <TableHeaderColumn>Status</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Object.keys(items).map((value, index) => {
                    console.log(items[value]);
                    return (
                        <TableRow key={index}>
                            <SortableItem key={`item-${index}`} index={index} value={items[value].name}/>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    );
});
export const CustomDragGrid = ({ids, data, basePath}) => {
    return (
        <div style={{margin: '1em'}}>
            <SortableComponent ids={ids} data={data}/>
        </div>
    )
};

CustomDragGrid.defaultProps = {
    data: {},
    ids: []
};

class SortableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: props.data,
            ids: props.ids
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            items: newProps.data,
            ids: newProps.ids
        })
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState({
            items: arrayMove(this.state.items, oldIndex, newIndex),
        });
    };

    render() {
        return <SortableList items={this.state.items} onSortEnd={this.onSortEnd}/>;
    }
}

// export default SortableComponent