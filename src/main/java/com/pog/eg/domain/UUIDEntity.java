package com.pog.eg.domain;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.proxy.HibernateProxyHelper;
import org.springframework.validation.Errors;

import javax.persistence.*;
import java.io.Serializable;
import java.util.UUID;

/**
 * created on 19/12/2558
 *
 * @author Phuttipong
 */
@MappedSuperclass
abstract class UUIDEntity implements Serializable {

    private Errors errorResult;
    private UUID id;

    UUIDEntity() {
    }

    public boolean hasErrors() {
        return errorResult != null && errorResult.hasErrors();
    }

    @Transient
    public Errors getErrors() {
        return errorResult;
    }

    public void setErrors(Errors errorResult) {
        this.errorResult = errorResult;
    }

    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "BINARY(16)")
    @Id
    public UUID getId() {
        return id;
    }

    private void setId(UUID id) {
        this.id = id;
    }

    @Override
    public int hashCode() {
        return id == null ? System.identityHashCode(this) : id.hashCode();
    }

    @SuppressWarnings("EqualsWhichDoesntCheckParameterClass")
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (!HibernateProxyHelper.getClassWithoutInitializingProxy(this)
                .equals(HibernateProxyHelper.getClassWithoutInitializingProxy(obj))) {
            return false;
        }
        final UUIDEntity other = (UUIDEntity) obj;
        return this.id.equals(other.getId());
    }
}
