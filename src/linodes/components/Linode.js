import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { flags, distros as distroAssets } from '~/assets';
import moment from 'moment';

import StatusDropdown from './StatusDropdown';
import { Checkbox } from '~/components/form';

function renderPowerButton(props) {
  const { linode, onPowerOn, onReboot } = props;

  let [powerIcon, powerAction] = ['', () => {}];
  if (linode.status === 'offline') {
    [powerIcon, powerAction] = ['fa-power-off', onPowerOn];
  } else if (linode.status === 'running') {
    [powerIcon, powerAction] = ['fa-refresh', onReboot];
  }
  const powerActionF = () => powerAction(linode);

  return powerIcon === '' ? <span /> :
    <span className={`linode-power fa ${powerIcon} float-xs-right`} onClick={powerActionF} />;
}

renderPowerButton.propTypes = {
  linode: PropTypes.object.isRequired,
  onPowerOn: PropTypes.func,
  onReboot: PropTypes.func,
};

export function renderPlanStyle(s) {
  if (!s || !s.label) return null;

  const plan = s.label.split(' ');
  return `${plan[0]} ${parseInt(plan[1], 10) / 1024}G`;
}

export function renderDistroStyle(linode) {
  if (!linode || !linode.distribution || !linode.distribution.vendor) {
    return 'Unknown';
  }

  return (
    <span className="distro-style">
      <img
        src={distroAssets[linode.distribution.vendor]
          ? distroAssets[linode.distribution.vendor] : '//placehold.it/50x50'}
        alt={linode.distribution.vendor}
        width="15" height="15"
      />
      <span>{linode.distribution.vendor}</span>
    </span>
  );
}

export function renderDatacenterStyle(linode) {
  return (
    <span className="datacenter-style">
      <img
        src={flags[linode.datacenter.country]
          ? flags[linode.datacenter.country] : '//placehold.it/50x50'}
        height="15" width="20" alt={linode.datacenter.label}
      />
      <span>{linode.datacenter.label}</span>
    </span>
  );
}

export function getNextBackup(linode) {
  const windows = {
    W0: moment().hour(0),
    W2: moment().hour(2),
    W4: moment().hour(4),
    W6: moment().hour(6),
    W8: moment().hour(8),
    W10: moment().hour(10),
    W12: moment().hour(12),
    W14: moment().hour(14),
    W16: moment().hour(16),
    W18: moment().hour(18),
    W20: moment().hour(20),
    W22: moment().hour(22),
  };
  if (!linode.backups || !linode.backups.schedule) {
    return moment.invalid();
  }
  const nextBackup = windows[linode.backups.schedule.window];
  if (nextBackup < moment()) {
    nextBackup.add(1, 'day');
  }
  return nextBackup;
}

export function renderBackupStatus(linode, dashboard = false) {
  const backupWord = dashboard ? '' : 'Backup';
  const up = (letter) => {
    if (dashboard) {
      return letter.toUpperCase();
    }
    return ` ${letter}`;
  };
  if (linode.backups.enabled) {
    const lastBackup = linode.backups.last_backup;
    if (!lastBackup) {
      const nextBackup = getNextBackup(linode);
      return (
        <Link className="backup-status" to={`/linodes/${linode.label}/backups`}>
          {backupWord}{up('i')}n ~{nextBackup.fromNow(true)}
        </Link>);
    }

    const backupStatus = linode.backups.last_backup.status;
    if (backupStatus === 'running') {
      return (
        <Link className="backup-status" to={`/linodes/${linode.label}/backups`}>
          {backupWord}{up('r')}unning
        </Link>);
    }

    if (backupStatus === 'pending') {
      return (
        <Link className="backup-status" to={`/linodes/${linode.label}/backups`}>
          {backupWord}{up('p')}ending
        </Link>);
    }
    return (
      <Link to={`/linodes/${linode.label}/backups`}>
        <span className="backup-status">
          {backupWord}{up('t')}aken {moment.utc(linode.backups.last_backup).fromNow()}
        </span>
      </Link>);
  }
  return (
    <span className="backup-status">
      <span>
        <Link
          to={`/linodes/${linode.label}/backups`}
        >Enable backups</Link>
      </span>
    </span>
  );
}

export function Linode(props) {
  const { linode, onSelect, isSelected } = props;
  const selectedClass = isSelected ? 'PrimaryTable-row--selected' : '';

  return (
    <tr className={`PrimaryTable-row ${selectedClass}`}>
      <td>
        <Checkbox
          className="PrimaryTable-rowSelector"
          checked={isSelected}
          onChange={() => onSelect(linode)}
        />
        <Link
          to={`/linodes/${linode.label}`}
          className="PrimaryTable-rowLabel"
          title={linode.id}
        >
          {linode.label}
        </Link>
      </td>
      <td id="ips">
        {linode.ipv4}
        <div className="text-muted">{linode.ipv6.split('/')[0]}</div>
      </td>
      <td>
        {renderDatacenterStyle(linode)}
      </td>
      <td>
        {renderBackupStatus(linode)}
      </td>
      <td className="PrimaryTable-rowOptions">
        <StatusDropdown
          linode={linode}
          dispatch={props.dispatch}
          className="float-xs-right"
        />
      </td>
    </tr>
  );
}

Linode.propTypes = {
  linode: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func,
  dispatch: PropTypes.func,
};
