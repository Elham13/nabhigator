deploymentsToKeep=1

cd /home/ubuntu/deployments
ls -t | grep '^navigator-admin[0-9]\{14\}$' | tail -n +$(($deploymentsToKeep + 1)) | xargs rm -rf
echo "Old deployments deleted."