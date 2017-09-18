import React from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

const styles={
    headLine: {
        fontSize: 16,
        fontWeight: 400
    },
    addNewButton: {
        float: 'right',
        marginTop: '-30px',
    }
}
/**
 * A simple table demonstrating the hierarchy of the `Table` component and its sub-components.
 */
const TableExampleSimple = () => (
    <div>
        <h2 style={styles.headLine}>CHANNELS</h2>
        <RaisedButton label="Add New" style={styles.addNewButton}/>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Link</TableHeaderColumn>
                    <TableHeaderColumn>Status</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableRowColumn>John Smith</TableRowColumn>
                    <TableRowColumn>Employed</TableRowColumn>
                    <TableRowColumn>Employed</TableRowColumn>
                </TableRow>
                <TableRow>
                    <TableRowColumn>Randal White</TableRowColumn>
                    <TableRowColumn>Unemployed</TableRowColumn>
                    <TableRowColumn>Employed</TableRowColumn>
                </TableRow>
            </TableBody>
        </Table>
    </div>
);

export default TableExampleSimple;